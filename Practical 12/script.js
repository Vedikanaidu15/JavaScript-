// NAME: VEDIKA NAIDU
// PRN : 24070521274
// Experiment 12: Interactive real-time web app using JavaScript + jQuery
// Covers: DOM manipulation, events, localStorage, AJAX (Open-Meteo + JSONPlaceholder)

$(function () {
  'use strict';

  /* ===================== STORAGE HELPERS ===================== */
  const KEY = { tasks: 'cp_tasks', city: 'cp_city', log: 'cp_log', marks: 'cp_marks' };

  function load(key, fallback) {
    try {
      const v = JSON.parse(localStorage.getItem(key));
      return v === null || v === undefined ? fallback : v;
    } catch (e) { return fallback; }
  }
  function save(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* storage blocked */ }
  }

  /* ===================== STATE ===================== */
  let tasks = load(KEY.tasks, []);
  let activity = load(KEY.log, []);
  let marks = load(KEY.marks, []);           // bookmarked post ids
  let city = load(KEY.city, { name: 'Mumbai, India', lat: 19.076, lon: 72.8777 });
  let filter = 'all';
  let posts = [];
  let feedLoaded = false;

  const pad = (n) => String(n).padStart(2, '0');
  const clockText = (d) => pad(d.getHours()) + ':' + pad(d.getMinutes()) + ':' + pad(d.getSeconds());

  /* ===================== TOAST + ACTIVITY LOG ===================== */
  let toastTimer;
  function toast(msg) {
    $('#toast').text(msg).addClass('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => $('#toast').removeClass('show'), 2600);
  }

  function logActivity(msg) {
    activity.unshift({ msg: msg, t: Date.now() });
    activity = activity.slice(0, 8);
    save(KEY.log, activity);
    renderLog();
  }

  function renderLog() {
    const $list = $('#log-list').empty();
    if (!activity.length) {
      $list.append($('<li>').text('No activity yet. Add a task or search a city.'));
      return;
    }
    activity.forEach((a) => {
      $list.append($('<li>').append($('<time>').text(clockText(new Date(a.t))), $('<span>').text(a.msg)));
    });
  }

  /* ===================== REAL-TIME CLOCK (setInterval) ===================== */
  function updateClock() {
    const now = new Date();
    const h = now.getHours();
    $('#clock').text(clockText(now));
    $('#date').text(now.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }));
    $('#greeting').text((h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening') + ', Vedika. Here is your live overview.');
  }
  updateClock();
  setInterval(updateClock, 1000);

  /* ===================== VIEW SWITCHING ===================== */
  function showView(name) {
    $('.nav-btn').removeClass('active').filter('[data-view="' + name + '"]').addClass('active');
    $('.view').removeClass('active');
    $('#view-' + name).addClass('active');
    $('#view-title').text({ overview: 'Overview', tasks: 'Tasks', feed: 'Live feed' }[name]);
    if (name === 'feed' && !feedLoaded) loadFeed();
  }
  $('.nav-btn').on('click', function () { showView($(this).data('view')); });
  $('[data-go]').on('click', function () { showView($(this).data('go')); });

  /* ===================== TASKS (DOM + events + storage) ===================== */
  function renderTasks() {
    const $list = $('#task-list').empty();
    const shown = tasks.filter((t) => filter === 'all' || (filter === 'done' ? t.done : !t.done));

    if (!shown.length) {
      $list.append($('<li class="empty">').text(tasks.length ? 'Nothing in this filter.' : 'No tasks yet. Add one above.'));
    }
    shown.forEach((t) => {
      const $li = $('<li class="task">').addClass(t.pri).toggleClass('done', t.done).attr('data-id', t.id);
      $li.append(
        $('<input type="checkbox" class="chk" aria-label="Mark done">').prop('checked', t.done),
        $('<span>').text(t.text),
        $('<button class="del" aria-label="Delete task">').html('&times;')
      );
      $list.append($li);
    });

    const done = tasks.filter((t) => t.done).length;
    const pct = tasks.length ? Math.round((done / tasks.length) * 100) : 0;
    $('#nav-count').text(tasks.length - done);
    $('#p-done').text(done);
    $('#p-total').text(tasks.length);
    $('#p-bar').css('width', pct + '%');
    $('#p-text').text(tasks.length ? pct + '% complete' + (pct === 100 ? '. Everything is done!' : '.') : 'Add your first task in the Tasks view.');
    save(KEY.tasks, tasks);
  }

  $('#task-form').on('submit', function (e) {
    e.preventDefault();
    const text = $.trim($('#task-input').val());
    if (!text) return;
    tasks.unshift({ id: Date.now(), text: text, pri: $('#task-pri').val(), done: false });
    $('#task-input').val('').focus();
    renderTasks();
    logActivity('Added task: ' + text);
    toast('Task added');
  });

  $('#task-list').on('change', '.chk', function () {
    const id = $(this).closest('.task').data('id');
    const t = tasks.find((x) => x.id === id);
    t.done = this.checked;
    renderTasks();
    logActivity((t.done ? 'Completed: ' : 'Reopened: ') + t.text);
  });
  $('#task-list').on('click', '.del', function () {
    const id = $(this).closest('.task').data('id');
    const t = tasks.find((x) => x.id === id);
    tasks = tasks.filter((x) => x.id !== id);
    renderTasks();
    logActivity('Deleted: ' + t.text);
  });
  $('.chip').on('click', function () {
    filter = $(this).data('filter');
    $('.chip').removeClass('active');
    $(this).addClass('active');
    renderTasks();
  });
  $('#clear-done').on('click', function () {
    const n = tasks.filter((t) => t.done).length;
    if (!n) return toast('No completed tasks to clear');
    tasks = tasks.filter((t) => !t.done);
    renderTasks();
    logActivity('Cleared ' + n + ' completed task(s)');
  });
  $('#clear-log').on('click', function () { activity = []; save(KEY.log, activity); renderLog(); });

  /* ===================== WEATHER (AJAX with $.getJSON) ===================== */
  function describe(code) {
    if (code === 0) return 'Clear sky';
    if (code <= 3) return 'Partly cloudy';
    if (code === 45 || code === 48) return 'Foggy';
    if (code >= 51 && code <= 57) return 'Drizzle';
    if (code >= 61 && code <= 67) return 'Rain';
    if (code >= 71 && code <= 77) return 'Snow';
    if (code >= 80 && code <= 82) return 'Rain showers';
    if (code >= 95) return 'Thunderstorm';
    return 'Unsettled';
  }

  function highlightQuick() {
    $('#quick button').each(function () {
      $(this).toggleClass('current', $(this).data('name') === city.name);
    });
  }

  function fetchWeather() {
    $('#wx-note').text('Updating...');
    $('#wx-city').text(city.name);
    highlightQuick();
    $.getJSON('https://api.open-meteo.com/v1/forecast', {
      latitude: city.lat,
      longitude: city.lon,
      current: 'temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code',
      timezone: 'auto'
    }).done(function (data) {
      const c = data.current;
      $('#wx-temp').text(Math.round(c.temperature_2m));
      $('#wx-desc').text(describe(c.weather_code));
      $('#wx-hum').text(c.relative_humidity_2m + '%');
      $('#wx-wind').text(Math.round(c.wind_speed_10m) + ' km/h');
      $('#wx-time').text(clockText(new Date()));
      $('#wx-note').text('Refreshes automatically every 60 seconds.');
    }).fail(function () {
      $('#wx-desc').text('Could not load weather');
      $('#wx-note').text('Network error. Check your internet connection; retrying in 60 seconds.');
    });
  }

  /* ===================== CITY SEARCH (AJAX geocoding) ===================== */
  function cityMsg(text, isError) {
    $('#city-msg').text(text).toggleClass('err', !!isError);
  }

  function setCity(c, fromSearch) {
    city = c;
    save(KEY.city, city);
    fetchWeather();
    logActivity('Weather city set to ' + city.name);
    cityMsg('Showing live weather for ' + city.name + '.');
    toast('Showing ' + city.name);
    if (!fromSearch) $('#city-alts').empty();
  }

  function labelOf(r) {
    return [r.name, r.admin1, r.country].filter(Boolean).join(', ');
  }

  $('#city-form').on('submit', function (e) {
    e.preventDefault();
    const raw = $.trim($('#city-input').val());
    if (!raw) { cityMsg('Type a city name first.', true); return; }

    // The search service understands city names only, so "Nagpur, India" becomes "Nagpur"
    const name = $.trim(raw.split(',')[0]);
    const $btn = $('#city-btn').prop('disabled', true).text('Searching...');
    $('#city-alts').empty();
    cityMsg('Searching for "' + name + '"...');

    $.ajax({
      url: 'https://geocoding-api.open-meteo.com/v1/search',
      data: { name: name, count: 5, language: 'en', format: 'json' },
      dataType: 'json',
      timeout: 8000
    }).done(function (res) {
      if (!res.results || !res.results.length) {
        cityMsg('No city found for "' + raw + '". Try only the city name, for example Nagpur.', true);
        return;
      }
      const list = res.results.map(function (r) {
        return { name: labelOf(r), lat: r.latitude, lon: r.longitude };
      });

      setCity(list[0], true);                       // best match is shown immediately
      $('#city-input').val('');

      if (list.length > 1) {                        // offer the other matches
        const $alts = $('#city-alts').empty().append($('<small>').text('Not the right one?'));
        list.slice(1).forEach(function (c) {
          $alts.append($('<button type="button">').text(c.name).on('click', function () { setCity(c, false); }));
        });
      }
    }).fail(function (xhr, status) {
      cityMsg(status === 'timeout'
        ? 'The search took too long. Try again, or use a quick city button.'
        : 'Could not reach the city search service. Check your internet, or use a quick city button.', true);
    }).always(function () {
      $btn.prop('disabled', false).text('Search');
    });
  });

  // Quick-city buttons (no search needed)
  $('#quick').on('click', 'button', function () {
    const $b = $(this);
    setCity({ name: $b.data('name'), lat: Number($b.data('lat')), lon: Number($b.data('lon')) }, false);
  });

  fetchWeather();
  setInterval(fetchWeather, 60000);           // real-time auto refresh

  /* ===================== LIVE FEED (AJAX with $.ajax) ===================== */
  function loadFeed() {
    $('#feed-status').text('Loading posts...').show();
    $.ajax({
      url: 'https://jsonplaceholder.typicode.com/posts',
      data: { _limit: 18 },
      dataType: 'json',
      timeout: 8000
    }).done(function (data) {
      posts = data;
      feedLoaded = true;
      $('#feed-status').hide();
      renderFeed();
      logActivity('Loaded ' + data.length + ' posts from the feed');
    }).fail(function () {
      $('#feed-status').html('Could not load posts. <button type="button" id="retry">Retry</button>').show();
    });
  }

  function renderFeed() {
    const term = $.trim($('#feed-search').val()).toLowerCase();
    const $feed = $('#feed-list').empty();
    const shown = posts.filter((p) => (p.title + ' ' + p.body).toLowerCase().indexOf(term) !== -1);

    $('#saved-count').text(marks.length + ' saved');
    if (!shown.length && feedLoaded) $('#feed-status').text('No posts match your filter.').show();
    else if (feedLoaded) $('#feed-status').hide();

    shown.forEach((p) => {
      const on = marks.indexOf(p.id) !== -1;
      $feed.append(
        $('<div class="post">').append(
          $('<h4>').text(p.title),
          $('<p>').text(p.body),
          $('<button class="star">').toggleClass('on', on).attr('data-id', p.id).text(on ? '★ Saved' : '☆ Save')
        )
      );
    });
  }

  $('#feed-search').on('keyup input', renderFeed);
  $('#feed-status').on('click', '#retry', loadFeed);
  $('#feed-list').on('click', '.star', function () {
    const id = Number($(this).data('id'));
    const i = marks.indexOf(id);
    if (i === -1) marks.push(id); else marks.splice(i, 1);
    save(KEY.marks, marks);
    renderFeed();
    toast(i === -1 ? 'Post saved' : 'Post removed from saved');
  });

  /* ===================== START ===================== */
  renderTasks();
  renderLog();
  highlightQuick();
});