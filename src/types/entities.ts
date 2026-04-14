export interface BaseEntity {
  id: string;
  name: string;
  slug: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export class BasePageOptionDto {
  keyword!: string;
  sort!: string;
  sorted!: string;
  from_date!: string;
  to_date!: string;
  page!: number;
  take!: number;
  number_records!: number;
  pages!: number;
  has_prev!: boolean;
  has_next!: boolean;
}

export class BaseCursorOptionDto {
  next_cursor!: string | null;
  has_next!: boolean;
}

export interface Organization extends BaseEntity { }

export interface Project extends BaseEntity {
  organization_id: string;
  created_by: string;
  updated_by: string;
}

export interface Feature extends BaseEntity {
  organization_id: string;
}

export interface Role extends BaseEntity {
  organization_id: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  created_at: string;
  updated_at: string;
  organizations: (Organization & { roles: Role[] })[];
}

export interface ListParams {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
  order?: 'asc' | 'desc';
  organization_id?: string;
  from_date?: string;
  to_date?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  paginated: BasePageOptionDto,
}

export interface CursorResponse<T> {
  data: T[];
  paginated: BaseCursorOptionDto,
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  user: User;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
}
