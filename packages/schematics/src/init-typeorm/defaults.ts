export interface ITypeormInitializer {
  db:
    | 'postgres'
    | 'mariadb'
    | 'mysql'
    | 'sqlite'
    | 'oracle'
    | 'mssql'
    | 'mongodb';
}

export const nesttypeorm = '^5.2.2';
export const typeorm = '^0.2.12';

export const dbpackages = {
  postgres: ['pg', '^7.3.0'],
  mariadb: ['mysql', '^2.14.1'],
  mysql: ['mysql', '^2.14.1'],
  sqlite: ['sqlite3', '^4.0.3'],
  oracle: ['oracledb', '^1.13.1'],
  mssql: ['mssql', '^4.0.4'],
  mongodb: ['mongodb', '^3.0.8'],
};
