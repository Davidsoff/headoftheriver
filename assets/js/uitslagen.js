// Interactive presentation of the results archive (static/data/uitslagen.json).
// Renders dependent dropdowns for category, year and event, and a filtered table.
(function () {
  "use strict";

  function init(container) {
    var src = container.dataset.src;
    if (!src) return;

    var selects = {
      category: container.querySelector('[data-filter="category"]'),
      year: container.querySelector('[data-filter="year"]'),
      event: container.querySelector('[data-filter="event"]'),
    };
    var tbody = container.querySelector('[data-role="rows"]');
    var count = container.querySelector('[data-role="count"]');
    var empty = container.querySelector('[data-role="empty"]');
    var table = container.querySelector('[data-role="table"]');

    var labels = {
      category: container.dataset.labelAll || "Alle",
      year: container.dataset.labelAll || "Alle",
      event: container.dataset.labelAll || "Alle",
    };

    var records = [];

    fetch(src)
      .then(function (r) {
        if (!r.ok) throw new Error("HTTP " + r.status);
        return r.json();
      })
      .then(function (data) {
        records = (data && data.records) || [];
        wireEvents();
        refresh();
      })
      .catch(function (err) {
        console.error("Kon uitslagen niet laden:", err);
        if (empty) {
          empty.textContent = "De uitslagen konden niet geladen worden.";
          empty.hidden = false;
        }
        if (table) table.hidden = true;
      });

    function selected() {
      return {
        category: selects.category ? selects.category.value : "",
        year: selects.year ? selects.year.value : "",
        event: selects.event ? selects.event.value : "",
      };
    }

    // Records matching the current selection, optionally ignoring one field
    // so a dropdown's own choice does not remove its other options.
    function filtered(ignore) {
      var sel = selected();
      return records.filter(function (r) {
        if (ignore !== "category" && sel.category && String(r.category) !== sel.category) return false;
        if (ignore !== "year" && sel.year && String(r.year) !== sel.year) return false;
        if (ignore !== "event" && sel.event && String(r.event) !== sel.event) return false;
        return true;
      });
    }

    function distinct(field) {
      var set = {};
      filtered(field).forEach(function (r) {
        set[String(r[field])] = true;
      });
      var values = Object.keys(set);
      if (field === "year") {
        values.sort(function (a, b) {
          return Number(b) - Number(a);
        });
      } else {
        values.sort(function (a, b) {
          return a.localeCompare(b, "nl");
        });
      }
      return values;
    }

    function populate(field) {
      var select = selects[field];
      if (!select) return;
      var current = select.value;
      var values = distinct(field);
      var html = '<option value="">' + labels[field] + "</option>";
      values.forEach(function (v) {
        html += '<option value="' + v + '">' + v + "</option>";
      });
      select.innerHTML = html;
      // Keep the previous choice if it is still available.
      if (current && values.indexOf(current) !== -1) {
        select.value = current;
      }
    }

    function escapeHtml(value) {
      return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
    }

    function render() {
      var rows = filtered();
      rows.sort(function (a, b) {
        if (b.year !== a.year) return b.year - a.year;
        var c = String(a.category).localeCompare(String(b.category), "nl");
        if (c !== 0) return c;
        return String(a.event).localeCompare(String(b.event), "nl");
      });

      tbody.innerHTML = rows
        .map(function (r) {
          return (
            "<tr>" +
            "<td>" + escapeHtml(r.year) + "</td>" +
            "<td>" + escapeHtml(r.category) + "</td>" +
            "<td>" + escapeHtml(r.event) + "</td>" +
            "<td>" + escapeHtml(r.winner) + "</td>" +
            "</tr>"
          );
        })
        .join("");

      if (count) count.textContent = rows.length + " uitslag" + (rows.length === 1 ? "" : "en");
      if (empty) empty.hidden = rows.length !== 0;
      if (table) table.hidden = rows.length === 0;
    }

    function refresh() {
      populate("category");
      populate("year");
      populate("event");
      render();
    }

    function wireEvents() {
      Object.keys(selects).forEach(function (key) {
        if (selects[key]) selects[key].addEventListener("change", refresh);
      });
      var reset = container.querySelector('[data-role="reset"]');
      if (reset) {
        reset.addEventListener("click", function () {
          if (selects.category) selects.category.value = "";
          if (selects.year) selects.year.value = "";
          if (selects.event) selects.event.value = "";
          refresh();
        });
      }
    }
  }

  function boot() {
    document.querySelectorAll("[data-uitslagen]").forEach(init);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
