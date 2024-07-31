import { z } from 'zod';

export const ActionEnum = z.enum([
  'grid_pan_mode',
  'show_command_palette',
  'toggle_presentation_mode',
  'close_overlay',
  'show_go_to_menu',
  'zoom_in',
  'zoom_out',
  'zoom_to_selection',
  'zoom_to_fit',
  'zoom_to_100',
  'save',
  'switch_sheet_next',
  'switch_sheet_previous',
  'clear_formatting_borders',
  'toggle_bold',
  'toggle_italic',
  'fill_right',
  'fill_down',
  'cancel_execution',
  'show_search',
  'copy_as_png',
  'download_as_csv',
  'undo',
  'redo',
  'select_all',
  'select_column',
  'select_row',
  'execute_code',
  'rerun_sheet_code',
  'rerun_all_code',
  'insert_cell_reference',
  'move_cursor_up',
  'jump_cursor_content_top',
  'expand_selection_up',
  'expand_selection_content_top',
  'move_cursor_down',
  'jump_cursor_content_bottom',
  'expand_selection_down',
  'expand_selection_content_bottom',
  'move_cursor_left',
  'jump_cursor_content_left',
  'expand_selection_left',
  'expand_selection_content_left',
  'move_cursor_right',
  'jump_cursor_content_right',
  'expand_selection_right',
  'expand_selection_content_right',
  'goto_A0',
  'goto_bottom_right',
  'goto_row_start',
  'goto_row_end',
  'page_up',
  'page_down',
  'move_cursor_right_with_selection',
  'move_cursor_left_with_selection',
  'edit_cell',
  'delete_cell',
  'show_cell_type_menu',
  'close_inline_editor',
  'save_inline_editor',
  'save_inline_editor_move_up',
  'save_inline_editor_move_right',
  'save_inline_editor_move_left',
  'remove_inserted_cells',
]);

export type Action = z.infer<typeof ActionEnum>;
