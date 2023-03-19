import React from 'react';
import './Board.css';
import classNames from 'classnames';

interface BoardProps {
  className?: string;
  children?: React.ReactNode;
}

export const Board: React.FC<BoardProps> = ({
  className,
  children,
}) => <div className={classNames('Board', className)}>{children}</div>;
