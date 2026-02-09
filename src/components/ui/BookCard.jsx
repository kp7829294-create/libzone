"use client";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, BookOpen, RotateCcw } from "lucide-react";
import Image from "next/image";

export function BookCard({ book, onBorrow, onReturn, borrowing, returning, hideBorrow, isBorrowed }) {
  const isBorrowing = borrowing === book.id;
  const isReturning = returning === book.borrowId;
  const showReturn = isBorrowed && onReturn && !hideBorrow;
  return (
    <Card className="group overflow-hidden border-none shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white">
      <div className="relative aspect-[3/4] overflow-hidden bg-slate-100">
        <Image
          src={book.image}
          alt={book.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-3 right-3">
          <Badge variant={book.available > 0 ? "secondary" : "destructive"} className="backdrop-blur-md bg-white/90">
            {book.available > 0 ? `${book.available} Available` : "Out of Stock"}
          </Badge>
        </div>
      </div>
      <CardContent className="p-4">
        <div className="flex items-center gap-1 mb-2">
          <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
          <span className="text-xs font-medium text-slate-600">{book.rating}</span>
          <span className="text-xs text-slate-400">• {book.category}</span>
        </div>
        <h3 className="font-display font-semibold text-lg leading-tight mb-1 text-slate-900 group-hover:text-primary transition-colors">
          {book.title}
        </h3>
        <p className="text-sm text-slate-500">{book.author}</p>
      </CardContent>
      {!hideBorrow && (
      <CardFooter className="p-4 pt-0">
        {showReturn ? (
          <Button
            className="w-full bg-amber-50 text-amber-700 hover:bg-amber-100 hover:text-amber-800 transition-all duration-300 group-hover:shadow-md"
            disabled={isReturning}
            onClick={() => onReturn?.(book.borrowId)}
          >
            {isReturning ? <span className="animate-pulse">Returning...</span> : <><RotateCcw className="w-4 h-4 mr-2" />Return Book</>}
          </Button>
        ) : (
          <Button
            className="w-full bg-slate-50 text-slate-700 hover:bg-primary hover:text-white transition-all duration-300 group-hover:shadow-md"
            disabled={book.available === 0 || isBorrowing}
            onClick={() => onBorrow?.(book.id)}
          >
            {isBorrowing ? <span className="animate-pulse">Borrowing...</span> : <><BookOpen className="w-4 h-4 mr-2" />{book.available > 0 ? "Borrow Book" : "Notify Me"}</>}
          </Button>
        )}
      </CardFooter>
    )}
    </Card>
  );
}
