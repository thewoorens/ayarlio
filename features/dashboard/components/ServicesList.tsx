type Service = {
  id: string;
  name: string;
  count: number;
  pct: number;
  color: string;
};

export default function ServiceList({ services }: { services: Service[] }) {
  return (
    <div
      className="p-5 bg-white rounded-xl"
      style={{ boxShadow: "0 1px 6px rgba(0,0,0,0.05)" }}
    >
      <h2 className="text-[15px] font-bold text-gray-800 mb-1">
        Popüler Hizmetler
      </h2>

      <p className="text-[12px] mb-5 text-gray-400">
        Bu ay en çok tercih edilenler
      </p>

      <div className="space-y-4">
        {services.length === 0 ? (
          <p className="text-sm text-gray-400">Henüz hizmet verisi yok.</p>
        ) : (
          services.map((s) => (
            <div key={s.id}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[13px] font-medium text-gray-700">
                  {s.name}
                </span>

                <span className="text-[12px] text-gray-400">{s.count}</span>
              </div>

              <div className="h-1.5 w-full rounded-full bg-gray-100">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${s.pct}%`,
                    background: s.color,
                  }}
                />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
