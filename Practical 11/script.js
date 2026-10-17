// NAME: VEDIKA NAIDU
// PRN : 24070521274
// Class Scheduler: ES6 (const/let, arrow functions, template literals,
// destructuring, spread), setTimeout and setInterval.
// Works by double-clicking index.html (no server needed).

(() => {
  'use strict';

  /* =====================  DATA  ===================== */
  const student = { name: 'VEDIKA NAIDU', prn: '24070521274' };

  const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  // day: 0 = Sunday ... 6 = Saturday, times in 24-hour HH:MM. Edit to match your timetable.
  const schedule = [
    // Monday
    { day: 1, start: '09:00', end: '10:00', subject: 'Data Structures', room: 'A-201' },
    { day: 1, start: '10:00', end: '11:00', subject: 'DBMS', room: 'B-105' },
    { day: 1, start: '11:15', end: '12:15', subject: 'Operating Systems', room: 'A-201' },
    { day: 1, start: '13:00', end: '15:00', subject: 'Web Technologies Lab', room: 'Lab 3' },
    // Tuesday
    { day: 2, start: '09:00', end: '10:00', subject: 'Engineering Maths', room: 'A-102' },
    { day: 2, start: '10:00', end: '11:00', subject: 'Web Technologies', room: 'B-105' },
    { day: 2, start: '11:15', end: '12:15', subject: 'Data Structures', room: 'A-201' },
    { day: 2, start: '14:00', end: '16:00', subject: 'Data Structures Lab', room: 'Lab 1' },
    // Wednesday
    { day: 3, start: '09:00', end: '10:00', subject: 'Operating Systems', room: 'A-201' },
    { day: 3, start: '10:00', end: '11:00', subject: 'DBMS', room: 'B-105' },
    { day: 3, start: '11:15', end: '12:15', subject: 'Engineering Maths', room: 'A-102' },
    { day: 3, start: '13:00', end: '15:00', subject: 'DBMS Lab', room: 'Lab 2' },
    // Thursday
    { day: 4, start: '09:00', end: '10:00', subject: 'Web Technologies', room: 'B-105' },
    { day: 4, start: '10:00', end: '11:00', subject: 'Data Structures', room: 'A-201' },
    { day: 4, start: '11:15', end: '12:15', subject: 'Operating Systems', room: 'A-201' },
    { day: 4, start: '14:00', end: '15:00', subject: 'Technical Seminar', room: 'Seminar Hall' },
    // Friday
    { day: 5, start: '09:00', end: '10:00', subject: 'Engineering Maths', room: 'A-102' },
    { day: 5, start: '10:00', end: '11:00', subject: 'DBMS', room: 'B-105' },
    { day: 5, start: '11:15', end: '12:15', subject: 'Web Technologies', room: 'B-105' },
    { day: 5, start: '13:00', end: '14:00', subject: 'Mentoring Session', room: 'Staff Room' },
    // Saturday
    { day: 6, start: '10:00', end: '12:00', subject: 'Mini Project Lab', room: 'Lab 3' },
  ];

  /* =====================  HELPERS  ===================== */
  const $ = (sel) => document.querySelector(sel);
  const pad = (n) => String(n).padStart(2, '0');
  const makeId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

  function formatDuration(ms) {
    const total = Math.max(0, Math.floor(ms / 1000));
    return {
      d: Math.floor(total / 86400),
      h: Math.floor((total % 86400) / 3600),
      m: Math.floor((total % 3600) / 60),
      s: total % 60,
    };
  }

  // "2d 03:14:09" or "03:14:09"
  function formatCountdown(ms) {
    const { d, h, m, s } = formatDuration(ms);
    const clock = `${pad(h)}:${pad(m)}:${pad(s)}`;
    return d > 0 ? `${d}d ${clock}` : clock;
  }

  const formatClock = (date) =>
    `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;

  const formatDate = (date) =>
    date.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  // "13:00" -> "1:00 PM"
  function to12h(time) {
    const [h, m] = time.split(':').map(Number);
    return `${h % 12 || 12}:${pad(m)} ${h >= 12 ? 'PM' : 'AM'}`;
  }

  const escapeHTML = (str) =>
    String(str).replace(/[&<>"']/g, (c) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  /* =====================  SCHEDULER LOGIC  ===================== */
  function slotDate(base, time, dayOffset = 0) {
    const d = new Date(base);
    d.setDate(d.getDate() + dayOffset);
    const [h, m] = time.split(':').map(Number);
    d.setHours(h, m, 0, 0);
    return d;
  }

  const getDaySlots = (list, day) =>
    list.filter((s) => s.day === day).sort((a, b) => a.start.localeCompare(b.start));

  // Every class for the next 8 days, sorted by start time
  function occurrences(list, now) {
    const out = [];
    for (let offset = 0; offset < 8; offset++) {
      const day = (now.getDay() + offset) % 7;
      getDaySlots(list, day).forEach((s) =>
        out.push({ ...s, startAt: slotDate(now, s.start, offset), endAt: slotDate(now, s.end, offset), offset })
      );
    }
    return out.sort((a, b) => a.startAt - b.startAt);
  }

  // Returns { current, next } (either can be null)
  function getState(list, now) {
    const occ = occurrences(list, now);
    return {
      current: occ.find((o) => o.startAt <= now && now < o.endAt) || null,
      next: occ.find((o) => o.startAt > now) || null,
    };
  }

  // 'done' | 'live' | 'upcoming' for a slot that belongs to today
  function getStatus(slot, now) {
    if (now >= slotDate(now, slot.end)) return 'done';
    if (now >= slotDate(now, slot.start)) return 'live';
    return 'upcoming';
  }

  /* =====================  UI RENDERING  ===================== */
  const RING_LENGTH = 339.292; // 2 * PI * r (r = 54)

  function renderClock(now) {
    $('#clock').textContent = formatClock(now);
    $('#date').textContent = formatDate(now);
  }

  // Updates the hero card in place so the ring animates smoothly
  function renderHero({ current, next }, now) {
    const hero = $('#hero');
    const slot = current || next;

    if (!slot) {
      hero.dataset.mode = 'idle';
      $('#hero-label').textContent = 'No classes scheduled';
      $('#hero-title').textContent = 'You are all clear';
      $('#hero-meta').textContent = 'Add classes to the schedule array in script.js.';
      $('#hero-after').textContent = '';
      $('#cd-main').textContent = '--:--:--';
      $('#cd-sub').textContent = '';
      return null;
    }

    const dayNote = slot.offset === 0 ? '' : slot.offset === 1 ? 'Tomorrow, ' : `${DAYS[slot.day]}, `;
    let remaining, progress;

    if (current) {
      hero.dataset.mode = 'live';
      $('#hero-label').textContent = 'In class now';
      remaining = current.endAt - now;
      progress = (now - current.startAt) / (current.endAt - current.startAt);
      $('#cd-sub').textContent = 'left in this class';
      $('#hero-after').textContent = next
        ? `Then: ${next.subject}, ${next.offset === 0 ? '' : next.offset === 1 ? 'tomorrow ' : DAYS[next.day] + ' '}${to12h(next.start)}`
        : 'This is the last class on the timetable.';
    } else {
      hero.dataset.mode = 'next';
      $('#hero-label').textContent = 'Up next';
      remaining = next.startAt - now;
      progress = 1 - Math.min(remaining, 86400000) / 86400000; // fills over the final 24 hours
      $('#cd-sub').textContent = 'until class starts';
      $('#hero-after').textContent = '';
    }

    $('#hero-title').textContent = slot.subject;
    $('#hero-meta').textContent = `${dayNote}${to12h(slot.start)} to ${to12h(slot.end)} in ${slot.room}`;
    $('#cd-main').textContent = formatCountdown(remaining);
    $('#ring-fg').style.strokeDashoffset = RING_LENGTH * (1 - Math.min(Math.max(progress, 0), 1));

    return formatCountdown(remaining);
  }

  function renderStats(now) {
    const today = getDaySlots(schedule, now.getDay());
    const done = today.filter((s) => getStatus(s, now) === 'done').length;
    $('#stat-total').textContent = today.length;
    $('#stat-done').textContent = done;
    $('#stat-left').textContent = today.length - done;
    $('#stat-day').textContent = DAYS[now.getDay()];
  }

  function renderTabs(selectedDay, todayDay) {
    const order = [1, 2, 3, 4, 5, 6, 0];
    $('#tabs').innerHTML = order
      .map(
        (d) => `<button class="tab${d === todayDay ? ' today' : ''}" role="tab" data-day="${d}"
          aria-selected="${d === selectedDay}">${DAYS[d].slice(0, 3)}</button>`
      )
      .join('');
  }

  function renderTimetable(selectedDay, now) {
    const slots = getDaySlots(schedule, selectedDay);
    const isToday = selectedDay === now.getDay();

    if (!slots.length) {
      $('#slots').innerHTML = `<li><p class="empty">No classes on ${DAYS[selectedDay]}. Enjoy the break.</p></li>`;
      return;
    }

    $('#slots').innerHTML = slots
      .map((s) => {
        const status = isToday ? getStatus(s, now) : '';
        const label = { done: 'Done', live: 'Live now', upcoming: 'Upcoming' }[status] || '';
        let bar = '';
        if (status === 'live') {
          const start = slotDate(now, s.start);
          const pct = ((now - start) / (slotDate(now, s.end) - start)) * 100;
          bar = `<span class="slot-bar" style="width:${pct.toFixed(1)}%"></span>`;
        }
        return `<li class="slot ${status}">
          <div class="slot-time">${to12h(s.start)}<small>to ${to12h(s.end)}</small></div>
          <div class="slot-title">${escapeHTML(s.subject)}<small>${escapeHTML(s.room)}</small></div>
          ${label ? `<span class="pill">${label}</span>` : ''}${bar}
        </li>`;
      })
      .join('');
  }

  function renderEvents(events) {
    const list = $('#event-list');
    if (!events.length) {
      list.innerHTML = '<li><p class="empty">No countdowns yet. Add an exam, deadline or submission above.</p></li>';
      return;
    }
    list.innerHTML = events
      .map((e) => {
        const when = new Date(e.at).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
        return `<li class="event-card" data-id="${e.id}" data-at="${e.at}">
          <span class="event-name">${escapeHTML(e.name)}</span>
          <span class="event-when">${when}</span>
          <span class="event-time">--</span>
          <button class="event-remove" data-remove="${e.id}" aria-label="Remove ${escapeHTML(e.name)}">&times;</button>
        </li>`;
      })
      .join('');
  }

  // Called every second by setInterval: updates only the text of each countdown
  function updateEventTimers(now) {
    document.querySelectorAll('.event-card').forEach((card) => {
      const diff = Number(card.dataset.at) - now.getTime();
      card.classList.toggle('over', diff <= 0);
      card.querySelector('.event-time').textContent = diff <= 0 ? 'Time is up' : formatCountdown(diff);
    });
  }

  function showToast(message, duration = 6000) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    $('#toasts').append(toast);
    setTimeout(() => toast.remove(), duration); // auto-dismiss
  }

  /* =====================  APP (timers + events)  ===================== */
  function initApp() {
    const STORAGE_KEY = 'class-scheduler-events';
    const REMINDER_LEAD_MS = 5 * 60 * 1000; // remind 5 minutes before class

    let selectedDay = new Date().getDay();
    let lastMinute = -1;
    let reminderKey = '';
    let reminderTimer = null;

    // ----- Custom event countdowns (saved in localStorage) -----
    function loadEvents() {
      try {
        const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
        if (Array.isArray(saved)) return saved;
      } catch (err) { /* ignore corrupted or blocked storage */ }
      const example = new Date(Date.now() + 10 * 86400000);
      example.setHours(10, 0, 0, 0);
      return [{ id: makeId(), name: 'Mid-sem exam', at: example.getTime() }];
    }

    function saveEvents() {
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(events)); } catch (err) { /* storage unavailable */ }
    }

    let events = loadEvents();
    const sortEvents = () => events.sort((a, b) => a.at - b.at);
    const notified = new Set(events.filter((e) => e.at <= Date.now()).map((e) => e.id));

    // ----- Reminder using setTimeout (re-scheduled only when the next class changes) -----
    function scheduleReminder(next, now) {
      if (!next) return;
      const key = `${next.subject}-${next.startAt.getTime()}`;
      if (key === reminderKey) return;
      reminderKey = key;
      clearTimeout(reminderTimer);

      const delay = next.startAt - now - REMINDER_LEAD_MS;
      if (delay > 0 && delay < 2 ** 31 - 1) {
        reminderTimer = setTimeout(() => {
          showToast(`${next.subject} starts in 5 minutes in ${next.room}.`);
        }, delay);
      }
    }

    // ----- Main tick: self-correcting setTimeout loop -----
    function tick() {
      const now = new Date();
      const state = getState(schedule, now);

      renderClock(now);
      const countdown = renderHero(state, now);
      renderStats(now);
      scheduleReminder(state.next, now);

      if (now.getMinutes() !== lastMinute) {
        lastMinute = now.getMinutes();
        renderTimetable(selectedDay, now);
      }

      document.title = countdown ? `${countdown} | Class Scheduler` : 'Class Scheduler';

      // run again exactly at the next second boundary, so the clock never drifts
      setTimeout(tick, 1000 - (Date.now() % 1000));
    }

    // ----- Event countdown timers: setInterval -----
    function eventTick() {
      const now = new Date();
      updateEventTimers(now);
      events.forEach((e) => {
        if (e.at <= now.getTime() && !notified.has(e.id)) {
          notified.add(e.id);
          showToast(`Countdown finished: ${e.name}`);
        }
      });
    }

    // ----- User interaction -----
    $('#tabs').addEventListener('click', (e) => {
      const tab = e.target.closest('[data-day]');
      if (!tab) return;
      selectedDay = Number(tab.dataset.day);
      renderTabs(selectedDay, new Date().getDay());
      renderTimetable(selectedDay, new Date());
    });

    $('#event-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const name = $('#event-name').value.trim();
      const at = new Date($('#event-date').value).getTime();
      if (!name || Number.isNaN(at)) return;
      if (at <= Date.now()) {
        showToast('Pick a date and time in the future.');
        return;
      }
      events.push({ id: makeId(), name, at });
      sortEvents();
      saveEvents();
      renderEvents(events);
      eventTick();
      e.target.reset();
    });

    $('#event-list').addEventListener('click', (e) => {
      const btn = e.target.closest('[data-remove]');
      if (!btn) return;
      events = events.filter((ev) => ev.id !== btn.dataset.remove);
      saveEvents();
      renderEvents(events);
      eventTick();
    });

    // ----- Start -----
    $('#student-name').textContent = student.name;
    $('#student-prn').textContent = student.prn;
    sortEvents();
    renderTabs(selectedDay, new Date().getDay());
    renderEvents(events);
    tick();
    eventTick();
    setInterval(eventTick, 1000);
  }

  initApp();
})();