import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    showInfo?: boolean;
    totalItems?: number;
    itemsPerPage?: number;
}

export function Pagination({
    currentPage,
    totalPages,
    onPageChange,
    showInfo = true,
    totalItems,
    itemsPerPage
}: PaginationProps) {
    const getVisiblePages = (isMobile = false) => {
        // Use smaller delta for mobile, larger for desktop
        const delta = isMobile ? 1 : 2;
        const range = [];
        const rangeWithDots = [];

        for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
            range.push(i);
        }

        if (currentPage - delta > 2) {
            rangeWithDots.push(1, '...');
        } else {
            rangeWithDots.push(1);
        }

        rangeWithDots.push(...range);

        if (currentPage + delta < totalPages - 1) {
            rangeWithDots.push('...', totalPages);
        } else {
            rangeWithDots.push(totalPages);
        }

        return rangeWithDots;
    };

    if (totalPages <= 1) {
        return showInfo && totalItems && itemsPerPage ? (
            <div className="text-sm text-gray-600">
                Показано {totalItems} из {totalItems}
            </div>
        ) : null;
    }

    return (
        <div className="flex items-center justify-between">
            {/* {showInfo && totalItems && itemsPerPage && (
                <div className="text-sm text-gray-600">
                    Показано {((currentPage - 1) * itemsPerPage) + 1}-{Math.min(currentPage * itemsPerPage, totalItems)} из {totalItems}
                </div>
            )} */}
            
            <div className="flex items-center space-x-1 md:space-x-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="text-xs md:text-sm"
                >
                    <ChevronLeft className="h-3 w-3 md:h-4 md:w-4" />
                    <span className="hidden sm:inline ml-1">Назад</span>
                </Button>

                {/* Desktop pagination - show more pages */}
                <div className="hidden md:flex items-center space-x-1">
                    {getVisiblePages(false).map((page, index) => (
                        <div key={index}>
                            {page === '...' ? (
                                <span className="px-3 py-2 text-sm">...</span>
                            ) : (
                                <Button
                                    variant={currentPage === page ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => onPageChange(page as number)}
                                    className="w-10"
                                >
                                    {page}
                                </Button>
                            )}
                        </div>
                    ))}
                </div>

                {/* Mobile pagination - show fewer pages */}
                <div className="flex md:hidden items-center space-x-1">
                    {getVisiblePages(true).map((page, index) => (
                        <div key={index}>
                            {page === '...' ? (
                                <span className="px-2 py-1 text-sm">...</span>
                            ) : (
                                <Button
                                    variant={currentPage === page ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => onPageChange(page as number)}
                                    className="w-8 h-8 text-xs"
                                >
                                    {page}
                                </Button>
                            )}
                        </div>
                    ))}
                </div>

                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="text-xs md:text-sm"
                >
                    <span className="hidden sm:inline mr-1">Вперед</span>
                    <ChevronRight className="h-3 w-3 md:h-4 md:w-4" />
                </Button>
            </div>
        </div>
    );
}
