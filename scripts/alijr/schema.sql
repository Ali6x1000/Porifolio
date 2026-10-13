create extension if not exists vector;

create table if not exists alijr_chunks (
  id text primary key,
  content text not null,
  folder_category text not null,
  project_root text,
  source_path text not null,
  page_label text,
  embedding vector(384) not null,
  created_at timestamptz not null default now()
);

create index if not exists alijr_chunks_folder_idx on alijr_chunks (folder_category);
create index if not exists alijr_chunks_project_idx on alijr_chunks (project_root);

create table if not exists alijr_documents (
  key text primary key,
  content text not null,
  updated_at timestamptz not null default now()
);
