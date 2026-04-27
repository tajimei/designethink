/**
 * Trip Planner - 予算シミュレーター ロジック & カレンダー表示
 */

document.addEventListener('DOMContentLoaded', () => {
    // 合計計算ボタン取得
    const calculateBtn = document.getElementById('calculate-btn');

    // カレンダー描画
    function renderCalendar() {
        const container = document.getElementById('calendar-container');
        if (!container) return; // カレンダー表示エリアがなければ何もしない
        container.innerHTML = '';

        const startInput = document.getElementById('start-date');
        const endInput = document.getElementById('end-date');
        const startDate = startInput.value ? new Date(startInput.value) : null;
        const endDate = endInput.value ? new Date(endInput.value) : null;

        // 今月のカレンダーを表示
        const today = new Date();
        const year = startDate ? startDate.getFullYear() : today.getFullYear();
        const month = startDate ? startDate.getMonth() : today.getMonth();

        // 月初・月末
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);

        // テーブル作成
        const table = document.createElement('table');
        table.className = 'calendar-table';

        // 曜日ヘッダー
        const days = ['日', '月', '火', '水', '木', '金', '土'];
        const thead = document.createElement('thead');
        const trHead = document.createElement('tr');
        days.forEach(d => {
            const th = document.createElement('th');
            th.textContent = d;
            trHead.appendChild(th);
        });
        thead.appendChild(trHead);
        table.appendChild(thead);

        // 日付部分
        const tbody = document.createElement('tbody');
        let tr = document.createElement('tr');
        // 空白
        for (let i = 0; i < firstDay.getDay(); i++) {
            tr.appendChild(document.createElement('td'));
        }
        for (let d = 1; d <= lastDay.getDate(); d++) {
            const td = document.createElement('td');
            td.textContent = d;

            const cellDate = new Date(year, month, d);

            // 今日
            if (
                cellDate.getFullYear() === today.getFullYear() &&
                cellDate.getMonth() === today.getMonth() &&
                cellDate.getDate() === today.getDate()
            ) {
                td.classList.add('today');
            }

            // 選択範囲
            if (startDate && endDate && cellDate >= startDate && cellDate <= endDate) {
                td.classList.add('selected');
            } else if (startDate && !endDate && cellDate.getTime() === startDate.getTime()) {
                td.classList.add('selected');
            }

            tr.appendChild(td);

            if ((firstDay.getDay() + d) % 7 === 0) {
                tbody.appendChild(tr);
                tr = document.createElement('tr');
            }
        }
        // 残り空白
        if (tr.children.length > 0) {
            while (tr.children.length < 7) {
                tr.appendChild(document.createElement('td'));
            }
            tbody.appendChild(tr);
        }
        table.appendChild(tbody);
        container.appendChild(table);
    }

    // カレンダー表示エリアがあればイベント登録
    if (document.getElementById('start-date') && document.getElementById('end-date')) {
        document.getElementById('start-date').addEventListener('change', renderCalendar);
        document.getElementById('end-date').addEventListener('change', renderCalendar);
    }

    // 初期表示（カレンダーエリアがあれば）
    if (document.getElementById('calendar-container')) {
        renderCalendar();
    }

    // 予算シミュレーター
    if (calculateBtn) {
        calculateBtn.addEventListener('click', () => {
            // 入力値の取得
            const transportPrice = Number(document.getElementById('transport').value) || 0;
            const hotelPricePerNight = Number(document.getElementById('hotel').value) || 0;
            const numberOfNights = Number(document.getElementById('nights').value) || 0;
            const dailyAllowance = Number(document.getElementById('daily').value) || 0;

            // 旅行日数は「宿泊数 + 1」
            const totalDays = (numberOfNights > 0) ? numberOfNights + 1 : 1;

            // 合計 = 交通費 + (1泊の宿泊費 × 泊数) + (1日の食費等 × 日数)
            const totalBudget = transportPrice + (hotelPricePerNight * numberOfNights) + (dailyAllowance * totalDays);

            // 結果の反映
            const totalPriceDisplay = document.getElementById('total-price');
            totalPriceDisplay.textContent = totalBudget.toLocaleString();

            // アニメーション効果
            totalPriceDisplay.style.transition = "transform 0.2s";
            totalPriceDisplay.style.transform = "scale(1.1)";
            setTimeout(() => {
                totalPriceDisplay.style.transform = "scale(1)";
            }, 200);
        });
    }
});