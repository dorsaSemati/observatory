const sheetID = "1hsp6-tgWhEbuszSYi0zTMpGYssvzEXZ7CyiDKpn6DTg";
const sheetName = "Sheet1";
const url = `https://docs.google.com/spreadsheets/d/${sheetID}/gviz/tq?tqx=out:json&sheet=${sheetName}`;

fetch(url)
  .then(res => res.text())
  .then(data => {
    const jsonData = JSON.parse(data.substr(47).slice(0, -2));
    const rows = jsonData.table.rows;
    const fields = {};
    rows.forEach(row => {
      const field = row.c[0]?.v;
      const galaxy_id = row.c[1]?.v;
      if (!fields[field]) fields[field] = [];
      fields[field].push(galaxy_id);
    });
    const container = document.getElementById('galaxy_list');
    Object.keys(fields).forEach(fieldName => {
      const fieldDiv = document.createElement('div');
      fieldDiv.className = 'field';
      // Accordion header
      const header = document.createElement('div');
      header.className = 'accordion-header';
      header.style.cursor = 'pointer';
      header.style.padding = '8px';
      header.style.marginTop = '4px';
      header.style.display = 'flex';
      header.style.justifyContent = 'space-between';
      header.style.alignItems = 'center';
      
      // Arrow span
      const arrow = document.createElement('span');
      arrow.textContent = '\u25B6'; // right-pointing triangle
      arrow.style.fontSize = '12px';
      arrow.style.display = 'inline-block';
      arrow.style.transition = 'transform 0.2s';
      
      header.appendChild(document.createTextNode(fieldName));
      header.appendChild(arrow);
      
      // Accordion content
      const galaxyList = document.createElement('div');
      galaxyList.className = 'galaxy-list';
      galaxyList.style.display = 'none';
      galaxyList.style.paddingLeft = '16px';

      fields[fieldName].forEach(galaxyID => {
        const link = document.createElement('a');
        link.href = `details.html?id=${galaxyID}`;
        link.textContent = `${fieldName}-${galaxyID}`;
        link.style.display = 'block';
        link.style.margin = '4px 0';
        galaxyList.appendChild(link);
      });

      header.addEventListener('click', () => {
        const isOpen = galaxyList.style.display === 'none';
        galaxyList.style.display = isOpen ? 'block' : 'none';
        arrow.style.transform = isOpen ? 'rotate(90deg)' : 'rotate(0deg)';
      });

      fieldDiv.appendChild(header);
      fieldDiv.appendChild(galaxyList);
      container.appendChild(fieldDiv);
    });

    // ---------- بخش جستجو اضافه شده ----------
    const allGalaxyEntries = [];
    const galaxyMap = {};

    Object.keys(fields).forEach(fieldName => {
      fields[fieldName].forEach(galaxyID => {
        const entry = `${fieldName}-${galaxyID}`;
        allGalaxyEntries.push(entry);
        galaxyMap[galaxyID.toString()] = { field: fieldName, full: entry };
      });
    });

    const datalist = document.getElementById('galaxy_suggestions');
    allGalaxyEntries.forEach(entry => {
      const option = document.createElement('option');
      option.value = entry;
      datalist.appendChild(option);
    });

    const searchInput = document.getElementById('search_input');
    const searchBtn = document.getElementById('search_btn');
    const searchResult = document.getElementById('search_result');

    function goToGalaxy(val) {
      val = val.trim();
      if (val === "") return;

      if (allGalaxyEntries.includes(val)) {
        const galaxyID = val.split("-")[1];
        window.location.href = `details.html?id=${galaxyID}`;
      } else if (galaxyMap[val]) {
        window.location.href = `details.html?id=${val}`;
      } else {
        searchResult.textContent = "Does not exist!";
        setTimeout(() => searchResult.textContent = "", 3000);
      }
    }

    searchBtn.addEventListener("click", () => {
      goToGalaxy(searchInput.value);
    });

    searchInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") goToGalaxy(searchInput.value);
    });
  });
