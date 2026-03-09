if (!sessionStorage.getItem('isLoggedIn')) {
  window.location.href = 'index.html'
}
let allIssues = []
let currentTab = 'all'

const loadAllDada = () => {
  showLoading(true)
  fetch('https://phi-lab-server.vercel.app/api/v1/lab/issues')
    .then(res => res.json())
    .then(data => {
      allIssues = data.data
      updateCounts()
      displayAllData(allIssues)
    })
}

const displayAllData = (AllData) => {
  const container = document.getElementById('all-card-container')
  container.innerHTML = ''
  showLoading(false)

  if (AllData.length === 0) {
    container.innerHTML = `
      <div class="col-span-4 text-center py-20 text-gray-400">
        <i class="fa-regular fa-folder-open text-5xl"></i>
        <p class="text-lg font-medium mt-4">No issues found</p>
      </div>`
    return
  }

  for (let issue of AllData) {
    const open = issue.status === 'open'
    const card = document.createElement('div')
    card.className = 'h-full'

    card.innerHTML = `
      <div onclick="openModal(${issue.id})" class="cursor-pointer bg-white rounded-xl shadow-sm border-t-4 ${open ? 'border-green-500' : 'border-violet-500'} p-4 md:p-5 hover:shadow-md transition-shadow fade-up h-full flex flex-col">
        <div class="flex justify-between items-start">
          <div class="w-9 h-9 rounded-full ${open ? 'bg-green-100' : 'bg-violet-100'} flex items-center justify-center shrink-0">
            <img src="assets/${open ? 'Open-Status' : 'Closed- Status '}.png" class="w-5 h-5" alt="">
          </div>
          <span class="px-3 py-1 ${getPriorityColor(issue.priority)} rounded-full text-xs font-medium">
            ${(issue.priority || 'normal').toUpperCase()}
          </span>
        </div>

        <h2 class="text-base md:text-lg font-semibold text-gray-800 mt-3">${issue.title}</h2>

        <p class="text-gray-400 text-sm mt-1 leading-relaxed">
          ${issue.description ? issue.description.slice(0, 80) + '...' : 'No description.'}
        </p>

        <div class="flex flex-wrap gap-2 mt-3">
          ${getLabelsHTML(issue.labels || [])}
        </div>

        <div class="border-t mt-auto pt-3 text-gray-400 text-xs md:text-sm">
          <p>#${issue.id} by <span class="font-medium text-gray-600">${issue.author || 'Unknown'}</span></p>
          <p>${formatDate(issue.createdAt)}</p>
        </div>
      </div>`

    container.appendChild(card)
  }
}

const setTab = (tab) => {
  currentTab = tab;
  ['all', 'open', 'closed'].forEach(t => {
    document.getElementById('tab-' + t).className = 'btn btn-outline btn-sm w-20 md:w-24'
  })
  document.getElementById('tab-' + tab).className = 'btn btn-primary btn-sm w-20 md:w-24'
  const list = tab === 'all' ? allIssues : allIssues.filter(i => i.status === tab)
  displayAllData(list)
  updateCounts()
}

const searchInputs = document.querySelectorAll('#search-input')
searchInputs.forEach(input => {
  input.addEventListener('input', function () {
    const q = this.value.trim()

    // sync both inputs
    searchInputs.forEach(el => { if (el !== this) el.value = this.value })

    if (!q) {
      const list = currentTab === 'all' ? allIssues : allIssues.filter(i => i.status === currentTab)
      displayAllData(list)
      return
    }

    showLoading(true)
    fetch('https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=' + encodeURIComponent(q))
      .then(res => res.json())
      .then(data => {
        showLoading(false)
        displayAllData(data.data || [])
      })
      .catch(() => showLoading(false))
  })
})
