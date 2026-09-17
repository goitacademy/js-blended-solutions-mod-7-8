const products = [
  {
    id: 1,
    name: 'Ноутбук',
    price: 32000,
    category: 'Комп’ютери',
    image: 'https://placehold.co/600x400?text=Laptop',
    sales: { week: 18 },
  },
  {
    id: 2,
    name: 'Навушники',
    price: 2500,
    category: 'Аудіо',
    image: 'https://placehold.co/600x400?text=Headphones',
    sales: { week: 26 },
  },
  {
    id: 3,
    name: 'Миша',
    price: 1200,
    category: 'Аксесуари',
    image: 'https://placehold.co/600x400?text=Mouse',
    sales: { week: 20 },
  },
  {
    id: 4,
    name: 'Клавіатура',
    price: 2800,
    category: 'Аксесуари',
    image: 'https://placehold.co/600x400?text=Keyboard',
    sales: { week: 12 },
  },
];

const sales = {
  week: [
    { label: 'Пн', value: 12 },
    { label: 'Вт', value: 19 },
    { label: 'Ср', value: 8 },
    { label: 'Чт', value: 15 },
    { label: 'Пт', value: 22 },
  ],
  month: [
    { label: '1 тиждень', value: 74 },
    { label: '2 тиждень', value: 91 },
    { label: '3 тиждень', value: 83 },
    { label: '4 тиждень', value: 108 },
  ],
};

// task 1
const productsList = document.querySelector('.js-products');

function renderProducts(items) {
  if (items.length === 0) {
    productsList.innerHTML = `<li>Товарів не знайдено</li>`;
    return;
  }

  const markup = items
    .map(
      ({ id, name, price, category, image }) => `
      <li class="product">
        <img src="${image}" alt="${name}" />
        <h2>${name}</h2>
        <p>${category}</p>
        <p>${price} грн</p>
        <button class="js-details" type="button" data-id="${id}">Детальніше</button>
      </li>
  `
    )
    .join('');

  productsList.innerHTML = markup;
}

renderProducts(products);

// task 2
const searchForm = document.querySelector('.js-search-form');

searchForm.addEventListener('submit', onSearch);

function onSearch(event) {
  event.preventDefault();

  const queryInput = event.currentTarget.elements.query;
  const normalizedQuery = queryInput.value.trim().toLowerCase();

  const filteredProducts = products.filter(product => {
    const normalizedName = product.name.toLowerCase();

    return normalizedName.includes(normalizedQuery);
  });

  renderProducts(filteredProducts);
}

// task 3
productsList.addEventListener('click', onProductsClick);

function onProductsClick(event) {
  const { target } = event;
  const button = target.closest('.js-details');

  if (!button) {
    return;
  }

  const productId = Number(button.dataset.id);

  const product = products.find(product => product.id === productId);

  if (!product) {
    return;
  }

  openProductModal(product);
}

// task 4
const modal = document.querySelector('.js-modal');
const btnClose = document.querySelector('.js-modal-close');
const modalImage = document.querySelector('.js-modal-image');
const modalTitle = document.querySelector('.js-modal-title');
const modalPrice = document.querySelector('.js-modal-price');
const modalSales = document.querySelector('.js-modal-sales');

function openProductModal({ name, price, image, sales: { week } }) {
  modalImage.src = image;
  modalImage.alt = name;
  modalTitle.textContent = name;
  modalPrice.textContent = `${price} грн`;
  modalSales.textContent = `Продажів за тиждень: ${week}`;

  modal.classList.add('is-open');

  window.addEventListener('keydown', onEscapeKeydown);
  btnClose.addEventListener('click', closeProductModal);
  modal.addEventListener('click', onClickBackdrop);
}

function onEscapeKeydown(e) {
  if (e.code !== 'Escape') {
    return;
  }
  closeProductModal();
}

function onClickBackdrop(e) {
  if (e.target !== e.currentTarget) {
    return;
  }
  closeProductModal();
}

function closeProductModal() {
  modal.classList.remove('is-open');
  removeEventListeners();
}

function removeEventListeners() {
  window.removeEventListener('keydown', onEscapeKeydown);
  btnClose.removeEventListener('click', closeProductModal);
  modal.removeEventListener('click', onClickBackdrop);
}

// task 5
const chartCanvas = document.querySelector('#sales-chart');
const periods = document.querySelector('.js-periods');
const chartSummary = document.querySelector('.js-chart-summary');

function getChartData(period) {
  const periodSales = sales[period];

  const labels = periodSales.map(({ label }) => label);
  const values = periodSales.map(({ value }) => value);

  return { labels, values };
}

const initialChartData = getChartData('week');

const salesChart = new Chart(chartCanvas, {
  type: 'bar',
  data: {
    labels: initialChartData.labels,
    datasets: [
      {
        label: 'Кількість продажів',
        data: initialChartData.values,
        backgroundColor: '#4f46e5',
      },
    ],
  },
  options: {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  },
});

function updateChartSummary(period) {
  const periodSales = sales[period];
  const totalSales = periodSales.reduce((total, { value }) => total + value, 0);

  chartSummary.textContent = `Продажів за ${period}: ${totalSales}`;
}

updateChartSummary('week');

periods.addEventListener('click', onPeriodClick);

function onPeriodClick(event) {
  const button = event.target.closest('button[data-period]');

  if (!button) {
    return;
  }

  const period = button.dataset.period;
  const chartData = getChartData(period);

  updateChartSummary(period);

  const activeButton = periods.querySelector('.is-active');

  activeButton.classList.remove('is-active');
  button.classList.add('is-active');

  salesChart.data.labels = chartData.labels;
  salesChart.data.datasets[0].data = chartData.values;
  salesChart.update();
}
