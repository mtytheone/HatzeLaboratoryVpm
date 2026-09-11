// パッケージ一覧は index.json を実行時に読み込んで描画する。
// package-list-action は Scriban テンプレートとしてこのファイルを処理するため、
// テンプレート区切り文字（波括弧2連）を含めないこと。
(function ()
{
  var listingUrl = new URL("index.json", window.location.href).href;
  document.getElementById("listingUrl").value = listingUrl;

  document.getElementById("addToVcc").addEventListener("click", function ()
  {
    window.location.assign("vcc://vpm/addRepo?url=" + encodeURIComponent(listingUrl));
  });

  document.getElementById("copyUrl").addEventListener("click", function ()
  {
    var button = this;
    navigator.clipboard.writeText(listingUrl).then(function ()
    {
      var original = button.textContent;
      button.textContent = "Copied";
      setTimeout(function () { button.textContent = original; }, 1500);
    });
  });

  // 同じパッケージの複数バージョンから最新を選ぶ
  function latestVersion(versions)
  {
    var keys = Object.keys(versions);
    keys.sort(function (a, b)
    {
      var pa = a.split(/[.\-+]/);
      var pb = b.split(/[.\-+]/);
      for (var i = 0; i < Math.max(pa.length, pb.length); i++)
      {
        var na = parseInt(pa[i], 10);
        var nb = parseInt(pb[i], 10);
        if (isNaN(na) && isNaN(nb)) { continue; }
        if (isNaN(na)) { return 1; }
        if (isNaN(nb)) { return -1; }
        if (na !== nb) { return nb - na; }
      }
      return 0;
    });
    return versions[keys[0]];
  }

  function render(listing)
  {
    var host = document.getElementById("packages");
    var names = Object.keys(listing.packages || {});
    if (names.length === 0)
    {
      host.innerHTML = '<p class="note">まだパッケージがありません。</p>';
      return;
    }

    host.innerHTML = "";
    names.forEach(function (name)
    {
      var pkg = latestVersion(listing.packages[name].versions);
      var card = document.createElement("div");
      card.className = "card";

      var title = document.createElement("div");
      title.className = "pkg-name";

      // package.json の documentationUrl があればタイトルをリンクにする。
      // javascript: などを弾くため http(s) のみ受け付ける
      var docUrl = pkg.documentationUrl || "";
      var hasLink = /^https?:\/\//i.test(docUrl);
      var label = document.createElement(hasLink ? "a" : "span");
      label.textContent = pkg.displayName || pkg.name;
      if (hasLink)
      {
        label.href = docUrl;
        label.target = "_blank";
        label.rel = "noopener";
      }
      title.appendChild(label);

      var badge = document.createElement("span");
      badge.className = "ver";
      badge.textContent = "v" + pkg.version;
      title.appendChild(badge);

      var id = document.createElement("div");
      id.className = "pkg-id";
      id.textContent = pkg.name;

      var desc = document.createElement("p");
      desc.className = "pkg-desc";
      desc.textContent = pkg.description || "";

      card.appendChild(title);
      card.appendChild(id);
      card.appendChild(desc);
      host.appendChild(card);
    });
  }

  fetch(listingUrl)
    .then(function (response) { return response.json(); })
    .then(render)
    .catch(function ()
    {
      document.getElementById("packages").innerHTML =
        '<p class="note">index.json を読み込めませんでした。</p>';
    });
})();
