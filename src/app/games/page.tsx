import CardList from "@/modules/games/cardList";

export default function Game() {
    return (
        <div className="w-full h-full flex flex-col justify-start">
            <h1 className="text-3xl font-bold mb-4">Life is Gaming</h1>
            <CardList />
        </div>
    );
}
