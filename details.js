const sheetID = "1hsp6-tgWhEbuszSYi0zTMpGYssvzEXZ7CyiDKpn6DTg";
const sheetName = "Sheet1";
const url = `https://docs.google.com/spreadsheets/d/${sheetID}/gviz/tq?tqx=out:json&sheet=${sheetName}`;
const UrlGalaxyId = new URLSearchParams(window.location.search).get('id');


fetch(url)
  .then(res => res.text())
  .then(data => {
    const jsonData = JSON.parse(data.substr(47).slice(0, -2));
    const rows = jsonData.table.rows;


    let selectedGalaxyRow = null
    rows.forEach(row => {
        const galaxy_id = row.c[1]?.v;
        //check if the galaxy_id matches the one in the URL
        if (galaxy_id == UrlGalaxyId) {
            selectedGalaxyRow = row;
        }
    });

    const field_name = selectedGalaxyRow.c[0]?.v;
    const galaxy_id = selectedGalaxyRow.c[1]?.v;
    const mass = selectedGalaxyRow.c[2]?.v;
    const sfr = selectedGalaxyRow.c[3]?.v;
    const z_spec = selectedGalaxyRow.c[4]?.v;
    const npix = selectedGalaxyRow.c[5]?.v;
    const gifsfh_url = selectedGalaxyRow.c[6]?.v;
    const gifmass_url = selectedGalaxyRow.c[7]?.v;
    const ra = selectedGalaxyRow.c[8]?.v;
    const dec = selectedGalaxyRow.c[9]?.v;

    //convert mass to a scintific number
    const massScientific = parseFloat(mass).toExponential(2);

    document.getElementById('field_name').textContent = field_name;
    document.getElementById('id').textContent = galaxy_id;
    document.getElementById('mass').textContent = massScientific;
    document.getElementById('sfr').textContent = sfr;
    document.getElementById('z_spec').textContent = z_spec;
    document.getElementById('npix').textContent = npix;
    document.getElementById('galaxy-image1').src = gifsfh_url;
    document.getElementById('galaxy-image2').src = gifmass_url;
    document.getElementById('ra').textContent = ra;
    document.getElementById('dec').textContent = dec;
  });
