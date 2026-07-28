-- ============================================================
-- Student Deadline Manager - Database Schema (MySQL)
-- Sinh ra dua tren cac entity TypeORM thuc te:
--   user.entity.ts, subject.entity.ts, task.entity.ts, notification-log.entity.ts
-- ============================================================

CREATE DATABASE IF NOT EXISTS student_deadline_manager
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE student_deadline_manager;

-- Xoa theo thu tu nguoc de tranh loi khoa ngoai khi tao lai
DROP TABLE IF EXISTS notification_logs;
DROP TABLE IF EXISTS tasks;
DROP TABLE IF EXISTS subjects;
DROP TABLE IF EXISTS users;

-- ------------------------------------------------------------
-- Bang: users  (nguon: auth/entities/user.entity.ts)
-- ------------------------------------------------------------
CREATE TABLE users (
  id                  INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  student_code        VARCHAR(50)   NOT NULL,
  full_name           VARCHAR(150)  NOT NULL,
  email               VARCHAR(150)  NOT NULL,
  password            VARCHAR(255)  NOT NULL,           -- bam bang bcrypt
  avatar_url          VARCHAR(500)  NULL,
  refresh_token_hash  VARCHAR(255)  NULL,                -- bam SHA-256 cua refresh token hien hanh
  created_at          DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at          DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP
                                     ON UPDATE CURRENT_TIMESTAMP,

  UNIQUE KEY uq_users_student_code (student_code),
  UNIQUE KEY uq_users_email (email)
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- Bang: subjects  (nguon: subjects/entities/subject.entity.ts)
-- ------------------------------------------------------------
CREATE TABLE subjects (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(100) NOT NULL,
  color       VARCHAR(7)   NOT NULL DEFAULT '#3498db',
  icon        VARCHAR(50)  NOT NULL DEFAULT 'book',
  user_id     INT UNSIGNED NOT NULL,
  created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
                           ON UPDATE CURRENT_TIMESTAMP,

  -- 1 user khong duoc tao 2 mon hoc trung ten
  UNIQUE KEY uq_user_subject (name, user_id),

  CONSTRAINT fk_subjects_user
    FOREIGN KEY (user_id) REFERENCES users (id)
    ON DELETE CASCADE
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- Bang: tasks  (nguon: tasks/entities/task.entity.ts)
-- ------------------------------------------------------------
CREATE TABLE tasks (
  id             CHAR(36)     NOT NULL PRIMARY KEY,       -- UUID
  user_id        INT UNSIGNED NOT NULL,
  subject_id     INT UNSIGNED NULL,
  title          VARCHAR(100) NOT NULL,
  type           VARCHAR(20)  NULL,
  task_datetime  DATETIME     NOT NULL,
  room           VARCHAR(50)  NULL,
  notes          TEXT         NULL,
  status         VARCHAR(20)  NOT NULL DEFAULT 'PENDING',
  created_at     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
                              ON UPDATE CURRENT_TIMESTAMP,

  CONSTRAINT ck_tasks_status
    CHECK (status IN ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'OVERDUE', 'CANCELLED')),

  KEY idx_tasks_user_id (user_id),
  KEY idx_tasks_subject_id (subject_id),
  KEY idx_tasks_status_datetime (status, task_datetime),

  CONSTRAINT fk_tasks_user
    FOREIGN KEY (user_id) REFERENCES users (id)
    ON DELETE CASCADE,

  CONSTRAINT fk_tasks_subject
    FOREIGN KEY (subject_id) REFERENCES subjects (id)
    ON DELETE SET NULL
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- Bang: notification_logs  (nguon: notification/entities/notification-log.entity.ts)
-- ------------------------------------------------------------
CREATE TABLE notification_logs (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  task_id       CHAR(36)     NOT NULL,
  message       TEXT         NOT NULL,
  scheduled_at  DATETIME     NOT NULL,
  status        VARCHAR(20)  NOT NULL DEFAULT 'PENDING',
  sent_at       DATETIME     NULL,
  created_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT ck_notification_logs_status
    CHECK (status IN ('PENDING', 'SENT', 'FAILED', 'CANCELLED')),

  KEY idx_notification_logs_task_id (task_id),
  KEY idx_notification_logs_status_scheduled (status, scheduled_at),

  CONSTRAINT fk_notification_logs_task
    FOREIGN KEY (task_id) REFERENCES tasks (id)
    ON DELETE CASCADE
) ENGINE=InnoDB;
