export default function Footer() {
    return (
        <footer className="bg-white dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 py-8 text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    &copy; 2024-{new Date().getFullYear()}{" "}
                    <a href="https://agcl.ink" className="text-blue-600">
                        AgCl
                    </a>
                    &nbsp;
                    <a
                        href="https://beian.miit.gov.cn/#/Integrated/index"
                        className="text-blue-600"
                    >
                        湘ICP备2025131827号
                    </a>
                </p>
            </div>
        </footer>
    );
}
