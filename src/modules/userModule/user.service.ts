import { ConflictException, Injectable, NotAcceptableException } from "@nestjs/common";
import { User } from "src/DB/models/user.model";
import UserRepository from "src/DB/repositories/userRepository";
import { createUserDto, signInDto } from "./DTO/userDto";
import { compare, hash } from "src/common/utils/security/hash.security";
import { generateOTP, sendEmail } from "src/common/utils/security/nodemailer/sendEmail";
import { eventEmitter, registerEmailEvent } from "src/common/utils/security/nodemailer/email.event";
import emailTemplate from "src/common/utils/security/nodemailer/emailTemplete";
import redisService from "src/common/cache/redis.service";
import { randomUUID } from "crypto";
import { TokenService } from "src/common/utils/security/token.service";
import { UserRoleEnum } from "src/common/enum/user.enum";


@Injectable()
export class UserService {
    constructor(private readonly userRepository: UserRepository, private readonly RedisService: redisService, private readonly tokenService: TokenService) { }

    async getUser() {
        return await this.userRepository.find(
            {
                filter: {}
            }
        )
    }
    async signUp(body: createUserDto) {
        const userExist = await this.userRepository.findOne({
            filter: {
                email: body.email
            }
        })
        if (userExist) {
            throw new ConflictException("user already exist")
        }

        const user = await this.userRepository.create({
            userName: body.userName,
            email: body.email,
            password: body.password,
            age: body.age,
            gender: body.gender
        })
        if (!user) {
            throw new NotAcceptableException("Something going wrong")
        }
        const OTP = generateOTP();
        const emailEvent = process.env.SEND_EMAIL_EVENT;

        if (!emailEvent) {
            throw new NotAcceptableException('SEND_EMAIL_EVENT is not configured');
        }

        registerEmailEvent(emailEvent);
        eventEmitter.emit(emailEvent, async () => {
            await sendEmail({
                to: body.email,
                subject: "Welcome to Social App",
                html: emailTemplate(body.userName, OTP.toString()),
            });
        });
        const hashedOTP = hash({ plainText: OTP.toString() });
        await this.RedisService.setRedis({ key: this.RedisService.otpKey({ email: user.email, subject: "signup" }), value: hashedOTP, ttl: 60 * 2 })
        await this.RedisService.setRedis({ key: this.RedisService.max_otp_key({ email: user.email, subject: "signup" }), value: 1, ttl: 60 * 2 })

        return user;
    }
    async signIn(body: signInDto) {
        console.log("body", body)
        const { password, email } = body;
        const userExist = await this.userRepository.findOne({
            filter: {
                email: email
            }
        })
        console.log(userExist);

        if (!userExist) {
            throw new NotAcceptableException("user not exist")
        }
        console.log(compare({ plainText: password as string, cipherText: userExist.password as string }));
        if (!compare({ plainText: password as string, cipherText: userExist.password as string })) {
            throw new NotAcceptableException("Invalid credentials")
        }

        const accessTokenId = randomUUID();
        const refreshTokenId = randomUUID();
        const ACCESS_TOKEN_ACCESS_ADMIN = process.env.ACCESS_TOKEN_ACCESS_ADMIN;
        const ACCESS_TOKEN_ACCESS_USER = process.env.ACCESS_TOKEN_ACCESS_USER;
        const REFRESH_TOKEN_ACCESS_ADMIN = process.env.REFRESH_TOKEN_ACCESS_ADMIN;
        const REFRESH_TOKEN_ACCESS_USER = process.env.REFRESH_TOKEN_ACCESS_USER;
        const accessToken =
            await this.tokenService.GenerateToken({
                payload: { userId: userExist._id, jti: accessTokenId, email: userExist.email, role: userExist.role },
                options: {
                    secret: userExist.role === UserRoleEnum.ADMIN
                        ? ACCESS_TOKEN_ACCESS_ADMIN!
                        : ACCESS_TOKEN_ACCESS_USER! as string, expiresIn: "1day"
                }
            });
        const refreshToken = await this.tokenService.GenerateToken({
            payload: { userId: userExist._id, jti: refreshTokenId, email: userExist.email, role: userExist.role },
            options: {
                secret: userExist.role === UserRoleEnum.ADMIN
                    ? REFRESH_TOKEN_ACCESS_ADMIN!
                    : REFRESH_TOKEN_ACCESS_USER! as string, expiresIn: "7day"
            }
        });
        await this.RedisService.deleteRedis(this.RedisService.otpKey({ email, subject: "signin" }))
        await this.RedisService.deleteRedis(this.RedisService.max_otp_key({ email, subject: "signin" }))
        await this.RedisService.deleteRedis(this.RedisService.revokedKey({ userId: userExist.id as string, jti: accessTokenId }));
        return { accessToken, refreshToken };

    }


}