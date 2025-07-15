import DFGunCode from "@/modules/games/dfGunCode";

export default function DFPage() {
    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold pb-4">抛瓦！！！</h1>
            <div className="w-full border border-gray-200 rounded-lg p-4">
                <DFGunCode />
            </div>
        </div>
    );
}
