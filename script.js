document.addEventListener('DOMContentLoaded', () => {
    // Navigation Logic
    const navItems = document.querySelectorAll('.nav-item');
    const contentArea = document.getElementById('content-area');

    // Initial Load
    loadPage('overview');

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();

            // Update Active State
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');

            // Load Content
            const page = item.getAttribute('data-page');
            if (page) loadPage(page);
        });
    });

    function loadPage(pageName) {
        // Clear current content
        contentArea.innerHTML = '';

        if (pageName === 'overview') {
            renderOverview();
        } else if (pageName === 'analysis') {
            renderAnalysis();
        } else if (pageName === 'reports') {
            renderReports();
        }
    }

    // --- Page Renderers ---

    function renderOverview() {
        const html = `
            <!-- Metrics Row -->
            <div class="metrics-grid">
                <div class="card metric-card">
                    <div class="metric-icon icon-bg-1"><i class="fa-solid fa-chart-bar"></i></div>
                    <div class="metric-info">
                        <span class="metric-label">总任务数</span>
                        <h3 class="metric-value">2,300</h3>
                        <span class="metric-trend positive">+12% <i class="fa-solid fa-arrow-up"></i></span>
                    </div>
                </div>
                <div class="card metric-card">
                    <div class="metric-icon icon-bg-2"><i class="fa-solid fa-triangle-exclamation"></i></div>
                    <div class="metric-info">
                        <span class="metric-label">智能评分均值</span>
                        <h3 class="metric-value">4.8%</h3>
                        <span class="metric-trend negative">-2% <i class="fa-solid fa-arrow-down"></i></span>
                    </div>
                </div>
                <div class="card metric-card">
                    <div class="metric-icon icon-bg-3"><i class="fa-solid fa-clipboard-check"></i></div>
                    <div class="metric-info">
                        <span class="metric-label">质检合格率</span>
                        <h3 class="metric-value">98.5%</h3>
                    </div>
                </div>
                <div class="card metric-card">
                    <div class="metric-icon icon-bg-4"><i class="fa-solid fa-user-check"></i></div>
                    <div class="metric-info">
                        <span class="metric-label">客户满意度</span>
                        <h3 class="metric-value">96.4</h3>
                    </div>
                </div>
            </div>

            <!-- Charts Row -->
            <div class="charts-grid">
                <div class="card chart-card wide">
                    <div class="card-header">
                        <h3>抽检数量趋势</h3>
                        <div class="card-actions">
                            <span style="font-size: 12px; color: #4318FF; margin-right: 10px;">● 方案筛选</span>
                            <span style="font-size: 12px; color: #8B5CF6; margin-right: 10px;">● 目标位</span>
                            <span style="font-size: 12px; color: #CBD5E1;">● 分布</span>
                        </div>
                    </div>
                    <div id="barChart" style="height: 300px;"></div>
                </div>
                <div class="card chart-card narrow">
                    <div class="card-header">
                        <h3>工单类型构成</h3>
                    </div>
                    <div id="donutChart" style="height: 300px;"></div>
                </div>
            </div>

            <!-- Table Row -->
            <div class="card table-card">
                <div class="card-header">
                    <h3>最新抽检工单记录</h3>
                    <button class="export-btn">查看全部</button>
                </div>
                <div class="table-responsive">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>工单编号</th>
                                <th>工单类型</th>
                                <th>病例类型</th>
                                <th>被抽检组别</th>
                                <th>抽检人</th>
                                <th>状态</th>
                                <th>完成时间</th>
                                <th>得分</th>
                            </tr>
                        </thead>
                        <tbody>
                            <!-- Data populated by JS -->
                        </tbody>
                    </table>
                </div>
            </div>
        `;
        contentArea.innerHTML = html;

        // Initialize Charts
        initBarChart();
        initDonutChart();
        populateTable();
    }

    function renderAnalysis() {
        const html = `
            <!-- AI Report Alert -->
            <div class="alert-banner">
                <div class="alert-icon"><i class="fa-regular fa-lightbulb"></i></div>
                <div class="alert-content">
                    <h4>AI 质量诊断报告</h4>
                    <p>监控数据显示：<strong>A7</strong> 类病例在 <strong>华东1组</strong> 的扣分频率显著高于平均水平 (+24%)。建议重点排查该组在“前牙美学区”设计规范上的执行情况，并安排专项培训。</p>
                </div>
            </div>

            <!-- Charts Row 1 -->
            <div class="charts-grid">
                <div class="card chart-card">
                    <div class="card-header">
                        <h3>扣分工单 - 病例类型分布</h3>
                    </div>
                    <div id="hBarChart1" style="height: 300px;"></div>
                </div>
                <div class="card chart-card">
                    <div class="card-header">
                        <h3>扣分工单 - 组别归属</h3>
                    </div>
                    <div id="barChart2" style="height: 300px;"></div>
                </div>
            </div>

            <!-- Charts Row 2 -->
            <div class="charts-grid" style="grid-template-columns: 1fr 2fr;">
                <div class="card chart-card">
                    <div class="card-header">
                        <h3>职级风险分布</h3>
                    </div>
                    <div id="pieChartAnalysis" style="height: 300px;"></div>
                </div>
                <div class="card table-card">
                    <div class="card-header">
                        <h3>重点关注：低分工单明细 (Top 10)</h3>
                    </div>
                    <div class="table-responsive">
                        <table class="data-table analysis-table">
                            <thead>
                                <tr>
                                    <th>工单编号</th>
                                    <th>被抽检人职级</th>
                                    <th>病例设计类型</th>
                                    <th>所属组别</th>
                                    <th>得分</th>
                                    <th>是否合格</th>
                                    <th>申诉状态</th>
                                </tr>
                            </thead>
                            <tbody>
                                <!-- Data populated by JS -->
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
        contentArea.innerHTML = html;

        // Initialize Charts
        initHBarChart1();
        initBarChart2();
        initPieChartAnalysis();
        populateAnalysisTable();
    }

    function renderReports() {
        const html = `
            <!-- Scatter Chart Section -->
            <div class="card chart-card" style="margin-bottom: 20px;">
                <div class="card-header">
                    <h3>质控效能矩阵分析</h3>
                    <div class="card-actions">
                        <span style="font-size: 12px; color: var(--text-secondary); margin-right: 10px;">● 均衡型 (推荐)</span>
                        <span style="font-size: 12px; color: var(--text-secondary);">● 偏差型 (需关注)</span>
                    </div>
                </div>
                <div id="scatterChart" style="height: 400px;"></div>
            </div>

            <!-- Comprehensive Table Section -->
            <div class="card table-card">
                <div class="card-header">
                    <h3>质检人员全量数据报表</h3>
                    <button class="export-btn">导出报表</button>
                </div>
                <div class="table-responsive">
                    <table class="data-table report-table">
                        <thead>
                            <tr>
                                <th>质检人员</th>
                                <th>处理总量</th>
                                <th>通过数</th>
                                <th>通过率</th>
                                <th>准确率</th>
                                <th>违规数 (Top 3)</th>
                                <th>申诉率</th>
                                <th>平均评分</th>
                                <th>月度环比</th>
                            </tr>
                        </thead>
                        <tbody>
                            <!-- Data populated by JS -->
                        </tbody>
                    </table>
                </div>
            </div>
        `;
        contentArea.innerHTML = html;

        // Initialize Charts
        initScatterChart();
        populateReportTable();
    }

    // --- Chart Initializers ---

    function initBarChart() {
        const chartDom = document.getElementById('barChart');
        if (!chartDom) return;
        const myChart = echarts.init(chartDom);
        const option = {
            tooltip: { trigger: 'axis' },
            legend: { show: false },
            grid: { left: '3%', right: '4%', bottom: '10%', containLabel: true },
            xAxis: { type: 'category', data: ['10月', '11月', '12月'], axisLine: { show: false }, axisTick: { show: false } },
            yAxis: { type: 'value', splitLine: { lineStyle: { type: 'dashed' } } },
            series: [
                { name: '方案筛选', type: 'bar', stack: 'total', itemStyle: { color: '#5B6BFF' }, data: [950, 1200, 1500] },
                { name: '目标位', type: 'bar', stack: 'total', itemStyle: { color: '#8B5CF6' }, data: [450, 350, 450] },
                { name: '分布', type: 'bar', stack: 'total', itemStyle: { color: '#CBD5E1', borderRadius: [5, 5, 0, 0] }, data: [650, 750, 850] }
            ]
        };
        myChart.setOption(option);
        window.addEventListener('resize', () => myChart.resize());
    }

    function initDonutChart() {
        const chartDom = document.getElementById('donutChart');
        if (!chartDom) return;
        const myChart = echarts.init(chartDom);
        const option = {
            tooltip: { trigger: 'item' },
            legend: { bottom: 0, data: ['方案筛选', '目标位', '分布'] },
            series: [
                {
                    name: '工单类型',
                    type: 'pie',
                    radius: ['50%', '75%'],
                    avoidLabelOverlap: false,
                    itemStyle: { borderRadius: 0, borderColor: '#fff', borderWidth: 2 },
                    label: { show: true, position: 'center', formatter: '{a|最大占比}\n{b|52%}\n{c|方案筛选}', rich: { a: { color: '#999', fontSize: 12, lineHeight: 20 }, b: { fontSize: 24, fontWeight: 'bold', color: '#333', lineHeight: 30 }, c: { fontSize: 12, color: '#5B6BFF', backgroundColor: '#EEF2FF', padding: [4, 8], borderRadius: 4 } } },
                    labelLine: { show: false },
                    data: [
                        { value: 52, name: '方案筛选', itemStyle: { color: '#5B6BFF' } },
                        { value: 28, name: '目标位', itemStyle: { color: '#8B5CF6' } },
                        { value: 20, name: '分布', itemStyle: { color: '#CBD5E1' } }
                    ]
                }
            ]
        };
        myChart.setOption(option);
        window.addEventListener('resize', () => myChart.resize());
    }

    function initHBarChart1() {
        const chartDom = document.getElementById('hBarChart1');
        if (!chartDom) return;
        const myChart = echarts.init(chartDom);
        const option = {
            tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
            grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
            xAxis: { type: 'value', show: false },
            yAxis: { type: 'category', data: ['A7', '种植导板', '缺牙间隙', '半口5-5', '全口拥挤'], axisLine: { show: false }, axisTick: { show: false } },
            series: [
                { name: '数量', type: 'bar', data: [18, 21, 18, 32, 26], itemStyle: { color: '#FF4D6D', borderRadius: [0, 5, 5, 0] }, label: { show: false } }
            ]
        };
        myChart.setOption(option);
        window.addEventListener('resize', () => myChart.resize());
    }

    function initBarChart2() {
        const chartDom = document.getElementById('barChart2');
        if (!chartDom) return;
        const myChart = echarts.init(chartDom);
        const option = {
            tooltip: { trigger: 'axis' },
            xAxis: { type: 'category', data: ['华东1', '华北1', '华西1', '华南1'], axisLine: { show: false }, axisTick: { show: false } },
            yAxis: { type: 'value', show: true, splitLine: { lineStyle: { type: 'dashed' } } },
            series: [
                { data: [29, 23, 33, 30], type: 'bar', itemStyle: { color: '#5B6BFF', borderRadius: [5, 5, 0, 0] }, barWidth: '40%' }
            ]
        };
        myChart.setOption(option);
        window.addEventListener('resize', () => myChart.resize());
    }

    function initPieChartAnalysis() {
        const chartDom = document.getElementById('pieChartAnalysis');
        if (!chartDom) return;
        const myChart = echarts.init(chartDom);
        const option = {
            tooltip: { trigger: 'item' },
            legend: { bottom: 0, icon: 'circle' },
            series: [
                {
                    name: '职级分布',
                    type: 'pie',
                    radius: '70%',
                    data: [
                        { value: 35, name: '初级助理', itemStyle: { color: '#CBD5E1' } },
                        { value: 25, name: '高级助理', itemStyle: { color: '#A78BFA' } },
                        { value: 40, name: '初级1星', itemStyle: { color: '#7C3AED' } }
                    ],
                    emphasis: { itemStyle: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: 'rgba(0, 0, 0, 0.5)' } }
                }
            ]
        };
        myChart.setOption(option);
        window.addEventListener('resize', () => myChart.resize());
    }

    function initScatterChart() {
        const chartDom = document.getElementById('scatterChart');
        if (!chartDom) return;
        const myChart = echarts.init(chartDom);

        // Approximate data from image
        const balancedData = [
            [67, 25], [40, 0], [30, 0], [18, 0]
        ];
        const deviationData = [
            [67, 90], [47, 68], [40, 50], [38, 100], [35, 100], [33, 100], [31, 50], [15, 50]
        ];

        const option = {
            grid: { left: '5%', right: '5%', bottom: '10%', top: '10%', containLabel: true },
            tooltip: {
                trigger: 'item',
                formatter: function (params) {
                    return params.seriesName + '<br/>检出率: ' + params.value[0] + '%<br/>申诉成功率: ' + params.value[1] + '%';
                }
            },
            xAxis: {
                type: 'value',
                name: '检出率 (严格度) →',
                nameLocation: 'middle',
                nameGap: 25,
                splitLine: { show: true, lineStyle: { type: 'dashed', color: '#eee' } }
            },
            yAxis: {
                type: 'value',
                name: '← 申诉成功率 (误判度)',
                nameLocation: 'middle',
                nameGap: 40,
                splitLine: { show: true, lineStyle: { type: 'dashed', color: '#eee' } }
            },
            series: [
                {
                    name: '均衡型 (推荐)',
                    type: 'scatter',
                    itemStyle: { color: '#5B6BFF' },
                    data: balancedData,
                    symbolSize: 12
                },
                {
                    name: '偏差型 (需关注)',
                    type: 'scatter',
                    itemStyle: { color: '#FF4D6D' },
                    data: deviationData,
                    symbolSize: 12
                }
            ]
        };
        myChart.setOption(option);
        window.addEventListener('resize', () => myChart.resize());
    }

    function populateTable() {
        const tbody = document.querySelector('.data-table tbody');
        if (!tbody) return;

        const data = [
            { id: 'AUD-1053', type: '方案筛选', caseType: '全口拥挤', group: '华东1', user: 'QC-User-1', state: '执行中', date: '2025-11-30', score: 74 },
            { id: 'AUD-1112', type: '分布', caseType: '半口5-5', group: '华北1', user: 'QC-User-6', state: '已完成', date: '2025-11-30', score: 84 },
            { id: 'AUD-1113', type: '分布', caseType: '半口5-5', group: '华东1', user: 'QC-User-12', state: '已完成', date: '2025-11-30', score: 88 },
            { id: 'AUD-1118', type: '分布', caseType: '全口拥挤', group: '华北1', user: 'QC-User-9', state: '已完成', date: '2025-11-30', score: 95 },
            { id: 'AUD-1129', type: '分布', caseType: '缺牙间隙', group: '华西1', user: 'QC-User-10', state: '已完成', date: '2025-11-30', score: 63 },
            { id: 'AUD-1013', type: '方案筛选', caseType: 'A7', group: '华东1', user: 'QC-User-10', state: '执行中', date: '2025-11-29', score: 100 },
            { id: 'AUD-1018', type: '目标位', caseType: 'A7', group: '华南1', user: 'QC-User-8', state: '已完成', date: '2025-11-29', score: 100 },
            { id: 'AUD-1066', type: '分布', caseType: '种植导板', group: '华西1', user: 'QC-User-7', state: '已完成', date: '2025-11-29', score: 73 },
        ];

        tbody.innerHTML = data.map(row => `
            <tr>
                <td style="font-weight: bold;">${row.id}</td>
                <td><span class="tag-gray">${row.type}</span></td>
                <td>${row.caseType}</td>
                <td>${row.group}</td>
                <td>
                    <div class="user-cell">
                        <div class="avatar-circle">${row.user.split('-')[2]}</div>
                        ${row.user}
                    </div>
                </td>
                <td><span class="status-dot ${row.state === '执行中' ? 'orange' : 'green'}">● ${row.state}</span></td>
                <td>${row.date}</td>
                <td style="font-weight: bold; color: ${row.score < 80 ? '#FF4D6D' : '#333'};">${row.score}</td>
            </tr>
        `).join('');
    }

    function populateAnalysisTable() {
        const tbody = document.querySelector('.analysis-table tbody');
        if (!tbody) return;

        const data = [
            { id: 'AUD-1002', rank: '初级1星', type: '种植导板', group: '华东1', score: 60, result: '不合格', appeal: '申诉失败' },
            { id: 'AUD-1063', rank: '初级助理', type: '全口拥挤', group: '华东1', score: 61, result: '不合格', appeal: '-' },
            { id: 'AUD-1110', rank: '初级1星', type: '全口拥挤', group: '华南1', score: 61, result: '不合格', appeal: '-' },
            { id: 'AUD-1030', rank: '初级助理', type: '全口拥挤', group: '华东1', score: 61, result: '不合格', appeal: '-' },
            { id: 'AUD-1088', rank: '初级1星', type: '半口5-5', group: '华南1', score: 62, result: '不合格', appeal: '-' },
            { id: 'AUD-1139', rank: '高级助理', type: '半口5-5', group: '华北1', score: 62, result: '不合格', appeal: '-' },
            { id: 'AUD-1129', rank: '初级1星', type: '缺牙间隙', group: '华西1', score: 63, result: '不合格', appeal: '-' },
            { id: 'AUD-1067', rank: '初级助理', type: 'A7', group: '华西1', score: 63, result: '不合格', appeal: '申诉失败' },
            { id: 'AUD-1149', rank: '初级1星', type: '缺牙间隙', group: '华南1', score: 63, result: '不合格', appeal: '申诉成功' },
            { id: 'AUD-1054', rank: '初级1星', type: '全口拥挤', group: '华东1', score: 64, result: '不合格', appeal: '申诉失败' },
        ];

        tbody.innerHTML = data.map(row => `
            <tr>
                <td style="font-weight: bold;">${row.id}</td>
                <td>${row.rank}</td>
                <td>${row.type}</td>
                <td>${row.group}</td>
                <td style="color: #FF4D6D; font-weight: bold;">${row.score} <span style="display:inline-block; width: 30px; height: 4px; background: #FFECEC; border-radius: 2px; vertical-align: middle; margin-left: 5px;"><span style="display:block; width: 40%; height: 100%; background: #FF4D6D; border-radius: 2px;"></span></span></td>
                <td><span class="status-badge fail-red">${row.result}</span></td>
                <td>${row.appeal}</td>
            </tr>
        `).join('');
    }

    function populateReportTable() {
        const tbody = document.querySelector('.report-table tbody');
        if (!tbody) return;

        // Keep existing data as placeholder since no specific image was provided for this table in the latest batch,
        // but ensure styling matches the general theme.
        const data = [
            { name: 'QC-User-A', total: 150, pass: 147, rate: '98.0%', accuracy: '99.5%', violation: 0, appeal: '0.0%', score: 98.5, growth: '+2.5%' },
            { name: 'QC-User-B', total: 145, pass: 140, rate: '96.5%', accuracy: '98.0%', violation: 1, appeal: '0.5%', score: 97.2, growth: '+1.8%' },
            { name: 'QC-User-C', total: 138, pass: 130, rate: '94.2%', accuracy: '97.5%', violation: 2, appeal: '1.2%', score: 96.0, growth: '-0.5%' },
            { name: 'QC-User-D', total: 160, pass: 158, rate: '98.7%', accuracy: '99.0%', violation: 0, appeal: '0.2%', score: 99.1, growth: '+3.0%' },
            { name: 'QC-User-E', total: 125, pass: 115, rate: '92.0%', accuracy: '95.5%', violation: 3, appeal: '2.5%', score: 94.5, growth: '-1.2%' },
            { name: 'QC-User-F', total: 140, pass: 135, rate: '96.4%', accuracy: '98.2%', violation: 1, appeal: '0.8%', score: 97.8, growth: '+1.5%' },
            { name: 'QC-User-G', total: 155, pass: 150, rate: '96.7%', accuracy: '98.5%', violation: 1, appeal: '0.6%', score: 98.0, growth: '+2.0%' },
            { name: 'QC-User-H', total: 130, pass: 120, rate: '92.3%', accuracy: '96.0%', violation: 2, appeal: '1.5%', score: 95.2, growth: '-0.8%' },
            { name: 'QC-User-I', total: 148, pass: 142, rate: '95.9%', accuracy: '97.8%', violation: 1, appeal: '0.9%', score: 97.5, growth: '+1.2%' },
            { name: 'QC-User-J', total: 110, pass: 100, rate: '90.9%', accuracy: '94.0%', violation: 4, appeal: '3.2%', score: 92.0, growth: '-2.5%' },
        ];

        tbody.innerHTML = data.map(row => `
            <tr>
                <td>
                    <div class="user-cell">
                        <div class="avatar-sm" style="background: #E0E5F2; display: flex; align-items: center; justify-content: center; font-size: 10px; color: #4318FF;">QC</div>
                        ${row.name}
                    </div>
                </td>
                <td>${row.total}</td>
                <td>${row.pass}</td>
                <td>${row.rate}</td>
                <td>${row.accuracy}</td>
                <td style="color: ${row.violation > 0 ? '#EE5D50' : '#2B3674'}">${row.violation}</td>
                <td style="color: ${parseFloat(row.appeal) > 1.0 ? '#EE5D50' : '#2B3674'}">${row.appeal}</td>
                <td>${row.score}</td>
                <td style="color: ${row.growth.startsWith('+') ? '#05CD99' : '#EE5D50'}">${row.growth}</td>
            </tr>
        `).join('');
    }
});
