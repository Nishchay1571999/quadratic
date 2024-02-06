/* eslint-disable @typescript-eslint/no-unused-vars */

import { editorInteractionStateAtom } from '@/atoms/editorInteractionStateAtom';
import { grid } from '@/grid/controller/Grid';
import { sheets } from '@/grid/controller/Sheets';
import { focusGrid } from '@/helpers/focusGrid';
import { SearchOptions, SheetPos } from '@/quadratic-core/types';
import { Button } from '@/shadcn/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/shadcn/ui/dropdown-menu';
import { Input } from '@/shadcn/ui/input';
import { Popover, PopoverAnchor, PopoverContent } from '@/shadcn/ui/popover';
import { colors } from '@/theme/colors';
import { MoreHoriz, NavigateBefore, NavigateNext } from '@mui/icons-material';
import { useEffect, useRef, useState } from 'react';
import { useRecoilState } from 'recoil';

export function Search() {
  const [editorInteractionState, setEditorInteractionState] = useRecoilState(editorInteractionStateAtom);
  const [searchOptions, setSearchOptions] = useState<SearchOptions>({
    case_sensitive: false,
    whole_cell: false,
    search_code: false,
    sheet_id: sheets.sheet.id,
  });
  const [results, setResults] = useState<SheetPos[]>([]);
  const [current, setCurrent] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const placeholder = !searchOptions.sheet_id ? 'Search all sheets...' : 'Search this sheet...';

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const search = e.target.value;
    if (search.length > 0) {
      const sheetPositions = grid.search(search, searchOptions);
      setResults(sheetPositions);
      setCurrent(0);
      dispatchEvent(new CustomEvent('search', { detail: { sheetPositions, current: 0 } }));
    } else {
      setResults([]);
      dispatchEvent(new CustomEvent('search'));
    }
  };

  const navigate = (delta: number) => {
    setCurrent((current) => (current + delta) % results.length);
  };

  const changeOptions = (option: 'case_sensitive' | 'whole_cell' | 'search_code' | 'sheet') => {
    if (option === 'sheet') {
      if (searchOptions.sheet_id) {
        setSearchOptions((prev) => ({ ...prev, sheet_id: undefined }));
      } else {
        setSearchOptions((prev) => ({ ...prev, sheet_id: sheets.sheet.id }));
      }
    } else {
      setSearchOptions((prev) => ({ ...prev, [option]: !prev[option] }));
    }
  };

  useEffect(() => {
    if (!editorInteractionState.showSearch) {
      setResults([]);
      setCurrent(0);
      focusGrid();
    }
  }, [editorInteractionState.showSearch]);

  return (
    <Popover open={editorInteractionState.showSearch}>
      <PopoverAnchor
        style={{
          position: 'absolute',
          right: '1rem',
          top: '100%',
        }}
      />
      <PopoverContent
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          width: '400px',
        }}
        onKeyDown={(e) => {
          // close search
          if (e.key === 'Escape') {
            setEditorInteractionState((prev) => ({ ...prev, showSearch: false }));
          }
        }}
      >
        <Input type="text" ref={inputRef} placeholder={placeholder} onChange={onChange} />
        {!!results.length && (
          <div style={{ whiteSpace: 'nowrap' }}>
            {current + 1} of {results.length}
          </div>
        )}
        {!!results.length && (
          <>
            <Button size="icon-sm" onClick={() => navigate(-1)}>
              <NavigateBefore />
            </Button>
            <Button size="icon-sm" onClick={() => navigate(1)}>
              <NavigateNext />
            </Button>
          </>
        )}
        {results.length === 0 && !!(inputRef.current as HTMLInputElement)?.value.length && (
          <div style={{ whiteSpace: 'nowrap', color: colors.quadraticSecondary }}>not found</div>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger>
            <MoreHoriz fontSize="small" />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuCheckboxItem checked={!searchOptions.sheet_id} onCheckedChange={() => changeOptions('sheet')}>
              Search all sheets
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={searchOptions.case_sensitive}
              onCheckedChange={() => changeOptions('case_sensitive')}
            >
              Case sensitive search
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={searchOptions.whole_cell}
              onCheckedChange={() => changeOptions('whole_cell')}
            >
              Match entire cell contents
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={searchOptions.search_code}
              onCheckedChange={() => changeOptions('search_code')}
            >
              Search within code
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </PopoverContent>
    </Popover>
  );
}
