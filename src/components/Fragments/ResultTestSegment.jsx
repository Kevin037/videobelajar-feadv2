import { CheckCircle, XCircle } from "lucide-react";

const TestResult = (props) => {
    const {orderData,type,classId} = props
    return (
        <>
            <img src="/assets/result.svg" alt="" />
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 mt-4">
                <div className=" mx-auto p-6 space-y-6">
                    <div>
                        <h2 className="text-lg font-semibold">Tanggal Pretest:</h2>
                        <p className="text-gray-600">23 September 2022, 10:20 AM</p>
                    </div>
                    <div className="grid grid-cols-4 border border-gray-300 overflow-hidden text-center">
                        <div className="bg-yellow-400 text-white border-r border-gray-300 flex flex-col justify-center py-6">
                            <span className="text-sm font-medium">Nilai</span>
                            <span className="text-3xl font-bold">100</span>
                        </div>
                        <div className="flex flex-col border-r border-gray-300 justify-center py-6">
                            <span className="text-sm font-medium text-gray-500">Soal</span>
                            <span className="text-2xl font-bold">10</span>
                        </div>
                        <div className="flex flex-col border-r border-gray-300 justify-center py-6">
                            <span className="text-sm font-medium text-gray-500">Benar</span>
                            <div className="flex items-center justify-center gap-1">
                                <CheckCircle className="text-green-600" size={20} />
                                <span className="text-2xl font-bold">10</span>
                            </div>
                        </div>
                        <div className="flex flex-col justify-center py-6">
                            <span className="text-sm font-medium text-gray-500">Salah</span>
                            <div className="flex items-center justify-center gap-1">
                                <XCircle className="text-red-600" size={20} />
                                <span className="text-2xl font-bold">0</span>
                            </div>
                        </div>
                    </div>

                    {/* Teks */}
                    <div>
                        <h3 className="text-lg font-semibold">Selesai!</h3>
                        <p className="text-gray-600">
                        Pretest sudah selesai dan kami sudah mengetahui progresmu.
                        </p>
                        <p className="text-gray-600 mt-1">Saatnya memulai kelas!</p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default TestResult