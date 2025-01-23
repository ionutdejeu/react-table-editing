import React from 'react';
import { DataTypes } from '../utils';
import TextIcon from '../img/Text';
import MultiIcon from '../img/Multi';
import HashIcon from '../img/Hash';

interface DataTypeIconProps {
  dataType: string;
}

const DataTypeIcon: React.FC<DataTypeIconProps> = ({ dataType }) => {
  const getPropertyIcon = (dataType: string) => {
    switch (dataType) {
      case DataTypes.NUMBER:
        return <HashIcon />;
      case DataTypes.TEXT:
        return <TextIcon />;
      case DataTypes.SELECT:
        return <MultiIcon />;
      default:
        return null;
    }
  };

  return getPropertyIcon(dataType);
};

export default DataTypeIcon;
