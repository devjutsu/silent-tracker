This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Next things:
[Boilerplate to check with](https://www.ory.sh/blog/enterprise-ready-saas-starter-kit)

### Do things:
- [x] dashboard in '/' page
- [x] fix user in Header
- [x] Toast to use Theme
- [x] Theme switch between Dark/Light instead of names
- [x] Change default avatar outlook
- [x] Ticking timer
- [x] Tracking state to fetch from DB
- [x] Make avatar only show for logged in user
- [x] Confirm purge with own dialog
- [ ] Add focus flow convenient edit/del
- [ ] Каждые N минут: "Как идёт фокус?" 🔥 Отлично / 🙂 Нормально / 😵 Расфокус | dropdown: чем занят? | optional tag.
- [ ] Автозаполнение по последней активности.
- [ ] Возможность отметить PulseRecord как "перерыв", "отвлёкся" и т.п.
- [ ] Если не было ни одного Pulse в течение сессии — можно подсказать: "попробуй отслеживать фокус внутри сессии"
- [ ] Make Flow widget visual
- [ ] Make Pulse widget visual
- [ ] {/* <Modal /> */}
- [ ] {/* <AlertDialog /> */}
- [ ] {/* <ConfirmDialog /> */}
- [ ] {/* <PromptDialog /> */}
- [ ] Sign in with Google OAuth
- [ ] Sign in with Facebook 
- [ ] Webhooks and Events
- [ ] Audit logs
- [ ] Internationalization
- [ ] Unify all rounded-xx classes

- [ ] Распространение
- [ ] Платная подписка
- [ ] Пуш нотификации
- [ ] Оповещения емэйл


## DB
### Pulse

```
-- Таблица для FlowEntry
CREATE TABLE flow (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP,
  goal TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT now(),
  title TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  interrupted BOOLEAN NOT NULL DEFAULT FALSE
);

-- Таблица для PulseRecord
CREATE TABLE pulse (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  flow_id UUID REFERENCES flow(id) ON DELETE SET NULL,
  created_at TIMESTAMP NOT NULL DEFAULT now(),
  focus_level INTEGER NOT NULL CHECK (focus_level >= 1 AND focus_level <= 10),
  activity TEXT NOT NULL,
  tag TEXT,
  energy_level INTEGER NOT NULL CHECK (energy_level >= 1 AND energy_level <= 10),
  mood TEXT,
  note TEXT,
  source TEXT CHECK (source IN ('manual', 'auto'))
);

-- (Необязательно) Индексы для быстрого поиска по пользователю и времени
CREATE INDEX idx_flow_user_time ON flow(user_id, start_time DESC);
CREATE INDEX idx_pulse_user_time ON pulse(user_id, created_at DESC);


```