import {
    HydratedDocument, Model, PopulateOptions, ProjectionType, QueryFilter, QueryOptions, Types
    , UpdateQuery
} from "mongoose";

abstract class baseRepository<TDocument> {
    constructor(private readonly model: Model<TDocument>) { }
    async create(date: Partial<TDocument>, options?: QueryOptions): Promise<HydratedDocument<TDocument>> {
        return await this.model.create(date)
    }
    async findAll(): Promise<HydratedDocument<TDocument>[]> {
        return await this.model.find()
    }
    async findById(id: Types.ObjectId): Promise<HydratedDocument<TDocument> | null> {
        return await this.model.findById(id)
    }
    async findOne({ filter, projection, options }: { filter?: QueryFilter<TDocument>, projection?: ProjectionType<TDocument>, options?: QueryOptions }): Promise<HydratedDocument<TDocument> | null> {
        return await this.model.findOne(filter, projection)
            .skip(options?.skip || 0)
            .limit(options?.limit || 0)
            .sort(options?.sort || {})
            .populate(options?.populate as PopulateOptions)
    }
    async find({ filter, projection, options }: { filter: QueryFilter<TDocument>, projection?: ProjectionType<TDocument>, options?: QueryOptions }): Promise<HydratedDocument<TDocument>[]> {
        return await this.model.find(filter, projection)
            .skip(options?.skip || 0)
            .limit(options?.limit || 0)
            .sort(options?.sort || {})
            .populate(options?.populate as PopulateOptions)
    }
    async fineOneAndDelete(filter: QueryFilter<TDocument>): Promise<HydratedDocument<TDocument> | null> {
        return await this.model.findOneAndDelete(filter)
    }
    async deleteMany(filter: QueryFilter<TDocument>): Promise<any> {
        return await this.model.deleteMany(filter)
    }
    async replace({ filter, replacement }: { filter: QueryFilter<TDocument>, replacement: TDocument }): Promise<HydratedDocument<TDocument> | null> {
        return this.model.findOneAndReplace(filter, replacement, { returnDocument: 'after' })
    }

    async findOneAndUpdate({ filter, update, options }: { filter: QueryFilter<TDocument>, update: UpdateQuery<TDocument>, options?: QueryOptions }): Promise<HydratedDocument<TDocument> | null> {
        return await this.model.findOneAndUpdate(filter, update, { returnDocument: 'after', ...options })
    }
    async pagination({ page, limit, sort, seacrh, populate }: { page?: number, limit?: number, sort?: string, populate?: any, seacrh?: any }) {
        page = +page! || 1;
        limit = +limit! || 10;

        if (page < 1) page = 1;
        if (limit < 1) limit = 1;

        const skip = (page - 1) * limit;
        const [data, totalDoc] = await Promise.all([
            await this.model.find({ ...(seacrh ?? {}) }).skip(skip).limit(limit).sort(sort).populate(populate).exec(),
            await this.model.countDocuments()
        ])
        const totalPages = Math.ceil(totalDoc / limit);
        return {
            meta: {
                page,
                limit,
                totalDoc,
                totalPages
            },
            data,
            totalDoc
        }

    }


}

export default baseRepository