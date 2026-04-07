import PlanList from "./components/PlanList";

export default function UpgradeView() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
            <div className="w-full max-w-7xl rounded-3xl bg-white/80 backdrop-blur-xl shadow-2xl p-8 md:p-12 text-center border border-white/20">
                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold mb-3 bg-linear-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                        Planınızı Yükseltin
                    </h1>
                    <p className="text-gray-600 mb-2 max-w-2xl mx-auto text-lg">
                        Ayarlio'yu kullanmaya devam etmek için planınızı yükseltmeniz gerekiyor.
                    </p>
                    <p className="text-gray-500 max-w-md mx-auto">
                        Hesabınız şu anda pasif durumda. Size en uygun planı seçin.
                    </p>
                </div>
                <PlanList />
            </div>
        </div>
    )
}