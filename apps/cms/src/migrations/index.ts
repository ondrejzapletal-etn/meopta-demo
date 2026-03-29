import * as migration_20260217_151406 from './20260217_151406';
import * as migration_20260217_170400 from './20260217_170400';
import * as migration_20260218_150102 from './20260218_150102';
import * as migration_20260218_210749 from './20260218_210749';
import * as migration_20260218_160000_add_mcp_api_keys from './20260218_160000_add_mcp_api_keys';
import * as migration_20260220_add_source_hash from './20260220_add_source_hash';
import * as migration_20260220_fix_gallery_fk from './20260220_fix_gallery_fk';
import * as migration_20260304_drop_hide_padding_columns from './20260304_drop_hide_padding_columns';
import * as migration_20260304_add_background_color_fields from './20260304_add_background_color_fields';
import * as migration_20260304_drop_download_section_unused_fields from './20260304_drop_download_section_unused_fields';
import * as migration_20260304_drop_benefits_with_list_expanded from './20260304_drop_benefits_with_list_expanded';
import * as migration_20260304_drop_download_section_file_url from './20260304_drop_download_section_file_url';
import * as migration_20260304_drop_branch_map_default_zoom from './20260304_drop_branch_map_default_zoom';
import * as migration_20260304_add_ab_testing from './20260304_add_ab_testing';
import * as migration_20260306_rename_layout_b_to_variant_b from './20260306_rename_layout_b_to_variant_b';
import * as migration_20260309_move_app_store_urls_to_settings from './20260309_move_app_store_urls_to_settings';
import * as migration_20260327_header_cta_appearance_extend from './20260327_header_cta_appearance_extend';

export const migrations = [
  {
    up: migration_20260217_151406.up,
    down: migration_20260217_151406.down,
    name: '20260217_151406',
  },
  {
    up: migration_20260217_170400.up,
    down: migration_20260217_170400.down,
    name: '20260217_170400',
  },
  {
    up: migration_20260218_150102.up,
    down: migration_20260218_150102.down,
    name: '20260218_150102',
  },
  {
    up: migration_20260218_210749.up,
    down: migration_20260218_210749.down,
    name: '20260218_210749',
  },
  {
    up: migration_20260218_160000_add_mcp_api_keys.up,
    down: migration_20260218_160000_add_mcp_api_keys.down,
    name: '20260218_160000_add_mcp_api_keys',
  },
  {
    up: migration_20260220_add_source_hash.up,
    down: migration_20260220_add_source_hash.down,
    name: '20260220_add_source_hash',
  },
  {
    up: migration_20260220_fix_gallery_fk.up,
    down: migration_20260220_fix_gallery_fk.down,
    name: '20260220_fix_gallery_fk',
  },
  {
    up: migration_20260304_drop_hide_padding_columns.up,
    down: migration_20260304_drop_hide_padding_columns.down,
    name: '20260304_drop_hide_padding_columns',
  },
  {
    up: migration_20260304_add_background_color_fields.up,
    down: migration_20260304_add_background_color_fields.down,
    name: '20260304_add_background_color_fields',
  },
  {
    up: migration_20260304_drop_download_section_unused_fields.up,
    down: migration_20260304_drop_download_section_unused_fields.down,
    name: '20260304_drop_download_section_unused_fields',
  },
  {
    up: migration_20260304_drop_benefits_with_list_expanded.up,
    down: migration_20260304_drop_benefits_with_list_expanded.down,
    name: '20260304_drop_benefits_with_list_expanded',
  },
  {
    up: migration_20260304_drop_download_section_file_url.up,
    down: migration_20260304_drop_download_section_file_url.down,
    name: '20260304_drop_download_section_file_url',
  },
  {
    up: migration_20260304_drop_branch_map_default_zoom.up,
    down: migration_20260304_drop_branch_map_default_zoom.down,
    name: '20260304_drop_branch_map_default_zoom',
  },
  {
    up: migration_20260304_add_ab_testing.up,
    down: migration_20260304_add_ab_testing.down,
    name: '20260304_add_ab_testing',
  },
  {
    up: migration_20260306_rename_layout_b_to_variant_b.up,
    down: migration_20260306_rename_layout_b_to_variant_b.down,
    name: '20260306_rename_layout_b_to_variant_b',
  },
  {
    up: migration_20260309_move_app_store_urls_to_settings.up,
    down: migration_20260309_move_app_store_urls_to_settings.down,
    name: '20260309_move_app_store_urls_to_settings',
  },
  {
    up: migration_20260327_header_cta_appearance_extend.up,
    down: migration_20260327_header_cta_appearance_extend.down,
    name: '20260327_header_cta_appearance_extend',
  },
];
