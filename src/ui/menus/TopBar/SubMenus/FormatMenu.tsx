import { Fragment } from 'react';
import Button from '@mui/material/Button';
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown';
import { Menu, MenuItem, MenuDivider, MenuHeader, SubMenu } from '@szhsin/react-menu';

import {
  FormatBold,
  FormatItalic,
  FormatAlignLeft,
  FormatAlignRight,
  FormatAlignCenter,
  FormatColorText,
  FormatColorFill,
  BorderColor,
  LineStyle,
  BorderAll,
  BorderOuter,
  BorderTop,
  BorderRight,
  BorderLeft,
  BorderBottom,
  BorderInner,
  BorderHorizontal,
  BorderVertical,
  ReadMore,
} from '@mui/icons-material';
import { PaletteOutlined } from '@mui/icons-material';
import Color from 'color';
import '@szhsin/react-menu/dist/index.css';
import { Tooltip } from '@mui/material';
import { colors } from '../../../../theme/colors';
import { useRecoilState } from 'recoil';
import { gridInteractionStateAtom } from '../../../../atoms/gridInteractionStateAtom';
import { menuItemIconStyles, topBarIconStyles } from './menuStyles';
import { updateFormatDB } from '../../../../core/gridDB/Cells/UpdateFormatDB';
import { CellFormat } from '../../../../core/gridDB/db';
export const FormatMenu = () => {
  const [interactionState] = useRecoilState(gridInteractionStateAtom);
  const multiCursor = interactionState.showMultiCursor;

  const onFormat = (options: { fillColor?: string; }): void => {
    const format: CellFormat = {};
    if (options.fillColor !== undefined) {
      format.fillColor = options.fillColor;
    }
    if (multiCursor) {
      const start = interactionState.multiCursorPosition.originPosition;
      const end = interactionState.multiCursorPosition.terminalPosition;
      const formats: CellFormat[] = [];
      for (let y = start.y; y <= end.y; y++) {
        for (let x = start.x; x <= end.x; x++) {
          formats.push({ ...format, x, y });
        }
      }
      updateFormatDB(formats);
    } else {
      format.x = interactionState.cursorPosition.x;
      format.y = interactionState.cursorPosition.y;
      updateFormatDB([format]);
    }
  };

  const testColor = Color('red');

  return (
    <Menu
      menuButton={
        <Tooltip title="Format" arrow>
          <Button style={{ color: colors.darkGray }}>
            <PaletteOutlined style={topBarIconStyles}></PaletteOutlined>
            <KeyboardArrowDown fontSize="small"></KeyboardArrowDown>
          </Button>
        </Tooltip>
      }
    >
      <MenuHeader>Text</MenuHeader>
      <MenuItem disabled>
        <FormatBold style={menuItemIconStyles}></FormatBold> Bold
      </MenuItem>
      <MenuItem disabled>
        <FormatItalic style={menuItemIconStyles}></FormatItalic> Italic
      </MenuItem>
      <MenuItem disabled>
        <FormatColorText style={menuItemIconStyles}></FormatColorText> Color
      </MenuItem>

      <MenuDivider />
      <SubMenu
        label={
          <Fragment>
            <ReadMore style={menuItemIconStyles}></ReadMore>
            <span>Wrapping</span>
          </Fragment>
        }
      >
        <MenuItem disabled>Overflow</MenuItem>
        <MenuItem disabled>Wrap</MenuItem>
        <MenuItem disabled>Clip</MenuItem>
      </SubMenu>

      <MenuDivider />
      <MenuItem disabled>
        <FormatAlignLeft style={menuItemIconStyles}></FormatAlignLeft> Left
      </MenuItem>
      <MenuItem disabled>
        <FormatAlignCenter style={menuItemIconStyles}></FormatAlignCenter> Center
      </MenuItem>
      <MenuItem disabled>
        <FormatAlignRight style={menuItemIconStyles}></FormatAlignRight> Right
      </MenuItem>

      <MenuDivider />
      <MenuHeader>Cell</MenuHeader>
      <MenuItem onClick={() => onFormat({ fillColor: testColor.toString() })}>
        <FormatColorFill style={menuItemIconStyles}></FormatColorFill> Fill Color
      </MenuItem>

      <SubMenu
        label={
          <Fragment>
            <BorderAll style={menuItemIconStyles}></BorderAll>
            <span>Border</span>
          </Fragment>
        }
      >
        <MenuItem>
          <BorderColor style={menuItemIconStyles}></BorderColor> Color
        </MenuItem>
        <MenuItem>
          <LineStyle style={menuItemIconStyles}></LineStyle>
          Line Style
        </MenuItem>
        {multiCursor && <MenuItem>
          <BorderAll style={menuItemIconStyles}></BorderAll> All
        </MenuItem>}
        <MenuItem>
          <BorderOuter style={menuItemIconStyles}></BorderOuter> Outer
        </MenuItem>
        <MenuItem>
          <BorderTop style={menuItemIconStyles}></BorderTop> Top
        </MenuItem>
        <MenuItem>
          <BorderLeft style={menuItemIconStyles}></BorderLeft> Left
        </MenuItem>
        <MenuItem>
          <BorderRight style={menuItemIconStyles}></BorderRight> Right
        </MenuItem>
        <MenuItem>
          <BorderBottom style={menuItemIconStyles}></BorderBottom> Bottom
        </MenuItem>
        {multiCursor && <MenuItem>
          <BorderInner style={menuItemIconStyles}></BorderInner> Inner
        </MenuItem>}
        {multiCursor && <MenuItem>
          <BorderHorizontal style={menuItemIconStyles}></BorderHorizontal> Horizontal
        </MenuItem>}
        {multiCursor && <MenuItem>
          <BorderVertical style={menuItemIconStyles}></BorderVertical> Vertical
        </MenuItem>}
      </SubMenu>
    </Menu>
  );
};
