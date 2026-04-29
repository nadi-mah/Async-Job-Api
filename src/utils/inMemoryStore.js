const store = new Map();

const get = (key) => {
  const item = store.get(key);

  if (!item) return null;

  if (item.expiresAt && item.expiresAt <= Date.now()) {
    store.delete(key);
    return null;
  }

  return item.value;
};

const set = (key, value, ttlMs) => {
  const expiresAt = ttlMs ? Date.now() + ttlMs : null;

  store.set(key, {
    value,
    expiresAt
  });
};

const del = (key) => {
  store.delete(key);
};

const incr = (key, ttlMs) => {
  const currentValue = get(key);

  if (currentValue === null) {
    set(key, 1, ttlMs);
    return 1;
  }

  const newValue = Number(currentValue) + 1;
  set(key, newValue, ttlMs);

  return newValue;
};

module.exports = {
  get,
  set,
  del,
  incr
};