export default function Footer() {
    return (
        <footer className="bg-white dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 py-8 text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    &copy; 2024-{new Date().getFullYear()} AgCl
                </p>
            </div>
        </footer>
    );
}
