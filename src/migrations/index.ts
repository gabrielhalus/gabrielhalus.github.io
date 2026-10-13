import * as migration_20261012_115702_initial from './20261012_115702_initial';
import * as migration_20261012_120838_home_clients from './20261012_120838_home_clients';
import * as migration_20261012_121431_qr_codes from './20261012_121431_qr_codes';
import * as migration_20261012_131024_home_hero_photo from './20261012_131024_home_hero_photo';
import * as migration_20261012_132330_home_hero_curso_tasks from './20261012_132330_home_hero_curso_tasks';
import * as migration_20261013_065716_cookies_auto_banner from './20261013_065716_cookies_auto_banner';

export const migrations = [
  {
    up: migration_20261012_115702_initial.up,
    down: migration_20261012_115702_initial.down,
    name: '20261012_115702_initial',
  },
  {
    up: migration_20261012_120838_home_clients.up,
    down: migration_20261012_120838_home_clients.down,
    name: '20261012_120838_home_clients',
  },
  {
    up: migration_20261012_121431_qr_codes.up,
    down: migration_20261012_121431_qr_codes.down,
    name: '20261012_121431_qr_codes',
  },
  {
    up: migration_20261012_131024_home_hero_photo.up,
    down: migration_20261012_131024_home_hero_photo.down,
    name: '20261012_131024_home_hero_photo',
  },
  {
    up: migration_20261012_132330_home_hero_curso_tasks.up,
    down: migration_20261012_132330_home_hero_curso_tasks.down,
    name: '20261012_132330_home_hero_curso_tasks',
  },
  {
    up: migration_20261013_065716_cookies_auto_banner.up,
    down: migration_20261013_065716_cookies_auto_banner.down,
    name: '20261013_065716_cookies_auto_banner'
  },
];
