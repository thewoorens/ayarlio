import Tenant from "@/models/Tenant";

export async function checkLimit(
    tenantId: string,
    key: string,
    increment = 0
) {
    const tenant = await Tenant.findById(tenantId);
    if (!tenant) throw new Error("TENANT_NOT_FOUND");

    const limit = tenant.limits?.[key];
    const usage = tenant.usage?.[key] ?? 0;

    if (limit !== undefined && usage + increment > limit) {
        throw new Error("LIMIT_EXCEEDED");
    }

    return tenant;
}

export async function incrementUsage(
    tenantId: string,
    key: string,
    amount = 1
) {
    const tenant = await Tenant.findByIdAndUpdate(
        tenantId,
        {
            $inc: { [`usage.${key}`]: amount },
        },
        { new: true }
    );

    if (!tenant) throw new Error("UPDATE_FAILED");

    return tenant;
}