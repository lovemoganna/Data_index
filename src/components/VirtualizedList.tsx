import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';

interface VirtualizedListProps<T> {
  items: T[];
  itemHeight: number;
  containerHeight: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  className?: string;
  overscan?: number; // 预渲染的额外项数
  onScroll?: (scrollTop: number) => void;
}

export function VirtualizedList<T>({
  items,
  itemHeight,
  containerHeight,
  renderItem,
  className = '',
  overscan = 5,
  onScroll
}: VirtualizedListProps<T>) {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // 计算可见区域
  const visibleRange = useMemo(() => {
    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
    const endIndex = Math.min(
      items.length - 1,
      Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
    );

    return { startIndex, endIndex };
  }, [scrollTop, itemHeight, containerHeight, items.length, overscan]);

  // 计算总高度
  const totalHeight = items.length * itemHeight;

  // 计算偏移量
  const offsetY = visibleRange.startIndex * itemHeight;

  // 获取要渲染的项
  const visibleItems = useMemo(() => {
    return items.slice(visibleRange.startIndex, visibleRange.endIndex + 1).map((item, index) => ({
      item,
      index: visibleRange.startIndex + index
    }));
  }, [items, visibleRange]);

  // 滚动处理
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const newScrollTop = e.currentTarget.scrollTop;
    setScrollTop(newScrollTop);
    onScroll?.(newScrollTop);
  }, [onScroll]);

  // 平滑滚动到指定位置
  const scrollToIndex = useCallback((index: number, align: 'start' | 'center' | 'end' = 'start') => {
    if (!containerRef.current) return;

    const itemTop = index * itemHeight;
    let scrollTop = itemTop;

    if (align === 'center') {
      scrollTop = itemTop - containerHeight / 2 + itemHeight / 2;
    } else if (align === 'end') {
      scrollTop = itemTop - containerHeight + itemHeight;
    }

    scrollTop = Math.max(0, Math.min(scrollTop, totalHeight - containerHeight));

    containerRef.current.scrollTo({
      top: scrollTop,
      behavior: 'smooth'
    });
  }, [itemHeight, containerHeight, totalHeight]);

  // 滚动到顶部
  const scrollToTop = useCallback(() => {
    containerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // 滚动到底部
  const scrollToBottom = useCallback(() => {
    if (!containerRef.current) return;
    const maxScrollTop = totalHeight - containerHeight;
    containerRef.current.scrollTo({ top: maxScrollTop, behavior: 'smooth' });
  }, [totalHeight, containerHeight]);

  return (
    <div
      ref={containerRef}
      className={`overflow-auto ${className}`}
      style={{ height: containerHeight }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div
          style={{
            transform: `translateY(${offsetY}px)`,
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0
          }}
        >
          {visibleItems.map(({ item, index }) => (
            <div
              key={index}
              style={{ height: itemHeight }}
              className="flex-shrink-0"
            >
              {renderItem(item, index)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// 虚拟化表格组件
interface VirtualizedTableProps<T> {
  data: T[];
  columns: {
    key: keyof T;
    title: string;
    width?: number;
    render?: (value: any, record: T, index: number) => React.ReactNode;
  }[];
  rowHeight: number;
  containerHeight: number;
  className?: string;
  onRowClick?: (record: T, index: number) => void;
}

export function VirtualizedTable<T extends Record<string, any>>({
  data,
  columns,
  rowHeight,
  containerHeight,
  className = '',
  onRowClick
}: VirtualizedTableProps<T>) {
  const renderRow = useCallback((item: T, index: number) => (
    <div
      className={`flex border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors ${
        index % 2 === 0 ? 'bg-white dark:bg-transparent' : 'bg-slate-50/20 dark:bg-slate-800/10'
      }`}
      onClick={() => onRowClick?.(item, index)}
    >
      {columns.map((column, colIndex) => {
        const value = item[column.key];
        const content = column.render ? column.render(value, item, index) : String(value || '');

        return (
          <div
            key={column.key}
            className="px-6 py-4 border-r border-slate-100 dark:border-slate-800 last:border-r-0 flex-shrink-0"
            style={{ width: column.width || 'auto', minWidth: column.width }}
          >
            {content}
          </div>
        );
      })}
    </div>
  ), [columns, onRowClick]);

  return (
    <div className={`border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden ${className}`}>
      {/* 表头 */}
      <div className="flex bg-slate-50 dark:bg-slate-800 border-b-2 border-slate-200 dark:border-slate-700 sticky top-0 z-10">
        {columns.map((column) => (
          <div
            key={column.key}
            className="px-6 py-4 font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.15em] text-[10px] border-r border-slate-200 dark:border-slate-700 last:border-r-0 flex-shrink-0"
            style={{ width: column.width || 'auto', minWidth: column.width }}
          >
            {column.title}
          </div>
        ))}
      </div>

      {/* 虚拟化内容 */}
      <VirtualizedList
        items={data}
        itemHeight={rowHeight}
        containerHeight={containerHeight - 48} // 减去表头高度
        renderItem={renderRow}
        className="custom-scrollbar"
      />
    </div>
  );
}
