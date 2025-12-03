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
            <!-- 1. KPI Cards Row -->
            <div class="metrics-grid">
                <!-- Card 1: 总完成率 -->
                <div class="kpi-card">
                    <div class="kpi-bg-shape"></div>
                    <div class="kpi-header">
                        <div class="kpi-icon-box bg-blue-light"><i class="fa-solid fa-check-square"></i></div>
                        <span class="kpi-title">总完成率</span>
                    </div>
                    <div>
                        <div class="kpi-value">55.6%</div>
                        <div class="kpi-subtext">完成: <span style="color:#2B3674;font-weight:600;">10</span> / 总数: 18</div>
                    </div>
                </div>

                <!-- Card 2: 按时交付率 -->
                <div class="kpi-card">
                    <div class="kpi-bg-shape"></div>
                    <div class="kpi-header">
                        <div class="kpi-icon-box bg-green-light"><i class="fa-solid fa-stopwatch"></i></div>
                        <span class="kpi-title">按时交付率</span>
                    </div>
                    <div>
                        <div class="kpi-value">38.9%</div>
                        <div class="kpi-subtext">超时工单: <span class="text-red">3</span></div>
                    </div>
                </div>

                <!-- Card 3: 本月工单总量 (紫色) -->
                <div class="kpi-card purple-card">
                    <div class="kpi-bg-shape"></div>
                    <div class="kpi-header">
                        <div class="kpi-icon-box bg-transparent-white"><i class="fa-solid fa-chart-line"></i></div>
                        <span class="kpi-title">本月工单总量</span>
                    </div>
                    <div>
                        <div class="kpi-value">18</div>
                        <div class="kpi-subtext">较上月环比 <span class="text-white-bold">+12.5%</span></div>
                    </div>
                </div>

                <!-- Card 4: 不合格率 -->
                <div class="kpi-card">
                    <div class="kpi-bg-shape"></div>
                    <div class="kpi-header">
                        <div class="kpi-icon-box bg-red-light"><i class="fa-solid fa-shield-halved"></i></div>
                        <span class="kpi-title">不合格率</span>
                    </div>
                    <div>
                        <div class="kpi-value">70.0%</div>
                        <div class="kpi-subtext">不合格数: <span class="text-red">7</span></div>
                    </div>
                </div>
            </div>

            <!-- 2. Middle Charts Row -->
            <div class="charts-row-2">
                <!-- Stacked Bar Chart -->
                <div class="card">
                    <div class="chart-header-row">
                        <div class="chart-title">抽检数量分布趋势</div>
                        <div class="chart-tag">工单类型维度</div>
                    </div>
                    <div id="stackedBarChart" style="height: 320px;"></div>
                </div>

                <!-- Line Chart -->
                <div class="card">
                    <div class="chart-header-row">
                        <div class="chart-title">抽检比例监控</div>
                    </div>
                    <div id="lineChart" style="height: 320px;"></div>
                </div>
            </div>

            <!-- 3. Bottom Charts Row -->
            <div class="charts-row-3">
                <!-- Donut 1 -->
                <div class="card">
                    <div class="chart-header-row">
                        <div class="chart-title">进度状态分析 (完成 vs 未完成)</div>
                    </div>
                    <div id="donutProgress" style="height: 300px;"></div>
                </div>

                <!-- Donut 2 -->
                <div class="card">
                    <div class="chart-header-row">
                        <div class="chart-title">按时交付分布</div>
                    </div>
                    <div id="donutOnTime" style="height: 300px;"></div>
                </div>
            </div>
        `;
        contentArea.innerHTML = html;

        // Initialize all charts
        initStackedBarChart();
        initLineChart();
        initDonutProgress();
        initDonutOnTime();
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

    function initStackedBarChart() {
        const chartDom = document.getElementById('stackedBarChart');
        const myChart = echarts.init(chartDom);
        const option = {
            tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
            legend: { bottom: 0, itemWidth: 12, itemHeight: 12 },
            grid: { left: '3%', right: '4%', bottom: '10%', top: '10%', containLabel: true },
            xAxis: {
                type: 'category',
                data: ['10月', '11月', '12月'],
                axisLine: { show: true, lineStyle: { color: '#E0E5F2' } },
                axisTick: { show: false },
                axisLabel: { color: '#A3AED0' }
            },
            yAxis: {
                type: 'value',
                splitLine: { show: false }, // Remove horizontal grid lines to match image style
                axisLabel: { color: '#A3AED0' }
            },
            series: [
                {
                    name: '方案筛选',
                    type: 'bar',
                    stack: 'total',
                    barWidth: 50,
                    itemStyle: { color: '#6366F1' }, // Blue-ish Purple
                    data: [950, 1200, 1500]
                },
                {
                    name: '目标位',
                    type: 'bar',
                    stack: 'total',
                    itemStyle: { color: '#8B5CF6' }, // Purple
                    data: [450, 350, 450]
                },
                {
                    name: '分布',
                    type: 'bar',
                    stack: 'total',
                    itemStyle: { color: '#A78BFA', borderRadius: [6, 6, 0, 0] }, // Light Purple
                    data: [650, 750, 850]
                }
            ]
        };
        myChart.setOption(option);
        window.addEventListener('resize', () => myChart.resize());
    }

    function initLineChart() {
        const chartDom = document.getElementById('lineChart');
        const myChart = echarts.init(chartDom);
        const option = {
            tooltip: { trigger: 'axis' },
            legend: { bottom: 0, icon: 'circle' },
            grid: { left: '3%', right: '4%', bottom: '10%', top: '15%', containLabel: true },
            xAxis: {
                type: 'category',
                data: ['10月', '11月', '12月'],
                boundaryGap: false,
                axisLine: { show: true, lineStyle: { color: '#E0E5F2' } },
                axisTick: { show: false },
                axisLabel: { color: '#A3AED0' }
            },
            yAxis: {
                type: 'value',
                min: 0,
                max: 30,
                interval: 5,
                splitLine: { lineStyle: { type: 'dashed', color: '#E0E5F2' } },
                axisLabel: { formatter: '{value}%', color: '#A3AED0' }
            },
            series: [
                {
                    name: '方案筛选',
                    type: 'line',
                    smooth: true,
                    symbolSize: 8,
                    itemStyle: { color: '#F59E0B' }, // Orange/Yellow
                    lineStyle: { width: 3 },
                    data: [20, 30, 10]
                },
                {
                    name: '目标位',
                    type: 'line',
                    smooth: true,
                    symbolSize: 8,
                    itemStyle: { color: '#EF4444' }, // Red
                    lineStyle: { width: 3 },
                    data: [5, 10, 2]
                },
                {
                    name: '分布',
                    type: 'line',
                    smooth: true,
                    symbolSize: 8,
                    itemStyle: { color: '#10B981' }, // Green
                    lineStyle: { width: 3 },
                    data: [4, 4, 5]
                }
            ]
        };
        myChart.setOption(option);
        window.addEventListener('resize', () => myChart.resize());
    }

    function initDonutProgress() {
        const chartDom = document.getElementById('donutProgress');
        const myChart = echarts.init(chartDom);
        const option = {
            tooltip: { trigger: 'item' },
            legend: { orient: 'vertical', right: '10%', top: 'center', icon: 'circle' },
            series: [
                {
                    name: '进度状态',
                    type: 'pie',
                    radius: ['55%', '75%'],
                    center: ['35%', '50%'],
                    avoidLabelOverlap: false,
                    label: { show: false },
                    data: [
                        { value: 55.6, name: '已完成', itemStyle: { color: '#6366F1' } },
                        { value: 44.4, name: '未完成 (执行中/暂停/终止)', itemStyle: { color: '#E2E8F0' } }
                    ]
                }
            ]
        };
        myChart.setOption(option);
        window.addEventListener('resize', () => myChart.resize());
    }

    function initDonutOnTime() {
        const chartDom = document.getElementById('donutOnTime');
        const myChart = echarts.init(chartDom);
        const option = {
            tooltip: { trigger: 'item' },
            legend: { orient: 'vertical', right: '10%', top: 'center', icon: 'circle' },
            series: [
                {
                    name: '交付分布',
                    type: 'pie',
                    radius: ['55%', '75%'],
                    center: ['35%', '50%'],
                    avoidLabelOverlap: false,
                    label: { show: false },
                    data: [
                        { value: 70, name: '按时完成', itemStyle: { color: '#10B981' } },
                        { value: 30, name: '超时完成', itemStyle: { color: '#EF4444' } }
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
