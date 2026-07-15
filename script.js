(function () {
	// ---- i18n ----
	const I18N = {
		zh: {
			langName: '中文',
			title: '模拟赛车燃油计算器',
			docTitle: '模拟赛车燃油计算器',
			introNote: '快速计算任何模拟赛车游戏（包括 ACC、iRacing、Assetto Corsa Evo、AMS2 等）的正确燃油量。只需输入每圈燃油量、比赛距离和油箱容量，即可查看需要进站次数和起始燃油量。',
			inputsHeader: '输入',
			resultsHeader: '结果',
			lblRaceTime: '比赛时间',
			lblLapTime: '平均单圈时间',
			lblFuelPerLap: '每圈油耗',
			lblTankCapacity: '油箱油量',
			placeholderHours: '小时',
			placeholderMinutes: '分钟',
			placeholderLapMin: '分',
			placeholderLapSec: '秒',
			sufHours: '小时',
			sufMinutes: '分钟',
			sufLapMin: '分',
			sufLapSec: '秒',
			sufFuelPerLap: '升/圈',
			sufTankCapacity: '升',
			btnCalculate: '计算',
			btnReset: '清空',
			lblTotalLaps: '总圈数',
			lblPitStops: '需要进站加油（次数）',
			lblMinFuel: '完赛最低需要燃油量',
			lblSafeFuel: '安全燃油（总圈数+2）',
			lblLapsPerStint: '每段比赛圈数（每箱）',
			lblLastStintLaps: '最后阶段圈数',
			lblStintFuelList: '每段行程的燃油消耗',
			lblLastStintFuel: '最后阶段的燃料量',
			formulaNote: '说明：总圈数按 ⌊比赛总时长 ÷ 平均单圈时间⌋ 计算。',
			cannotCompleteLap: '无法完成一圈（油箱容量过小）',
			unitLiter: '升'
		},
		en: {
			langName: 'English',
			title: 'Sim Racing Fuel Calculator',
			docTitle: 'Sim Racing Fuel Calculator',
			introNote: 'Quickly calculate the right fuel for any sim racing game (ACC, iRacing, Assetto Corsa Evo, AMS2, etc.). Enter fuel per lap, race duration and tank capacity to see pit stops and starting fuel.',
			inputsHeader: 'Inputs',
			resultsHeader: 'Results',
			lblRaceTime: 'Race duration',
			lblLapTime: 'Average lap time',
			lblFuelPerLap: 'Fuel per lap',
			lblTankCapacity: 'Tank capacity',
			placeholderHours: 'Hours',
			placeholderMinutes: 'Minutes',
			placeholderLapMin: 'Min',
			placeholderLapSec: 'Sec',
			sufHours: 'h',
			sufMinutes: 'min',
			sufLapMin: 'min',
			sufLapSec: 'sec',
			sufFuelPerLap: 'L/lap',
			sufTankCapacity: 'L',
			btnCalculate: 'Calculate',
			btnReset: 'Reset',
			lblTotalLaps: 'Total laps',
			lblPitStops: 'Pit stops (count)',
			lblMinFuel: 'Minimum fuel to finish',
			lblSafeFuel: 'Safe fuel (laps+2)',
			lblLapsPerStint: 'Laps per stint (per tank)',
			lblLastStintLaps: 'Last stint laps',
			lblStintFuelList: 'Fuel for first stint',
			lblLastStintFuel: 'Fuel for last stint',
			formulaNote: 'Note: Total laps = ⌊race duration ÷ average lap time⌋.',
			cannotCompleteLap: 'Cannot complete a lap (tank capacity too small)',
			unitLiter: 'L'
		}
	};

	let currentLocale = 'zh';

	function safeStorageGet(key) {
		try {
			return window.localStorage ? window.localStorage.getItem(key) : null;
		} catch (error) {
			return null;
		}
	}

	function safeStorageSet(key, value) {
		try {
			if (window.localStorage) window.localStorage.setItem(key, value);
			return true;
		} catch (error) {
			return false;
		}
	}

	function safeStorageRemove(key) {
		try {
			if (window.localStorage) window.localStorage.removeItem(key);
		} catch (error) {
			// Storage can be unavailable for local file pages on mobile browsers.
		}
	}


	function detectLocale() {
		const saved = safeStorageGet('locale');
		if (saved === 'zh' || saved === 'en') return saved;
		const nav = (navigator.language || navigator.userLanguage || '').toLowerCase();
		return nav.startsWith('zh') ? 'zh' : 'en';
	}

	function applyTranslations(locale) {
		const t = I18N[locale] || I18N.zh;
		currentLocale = locale;
		// html lang
		document.documentElement.setAttribute('lang', locale === 'zh' ? 'zh-CN' : 'en');
		// document and title
		document.title = t.docTitle;
		const map = [
			['title', 'title'],
			['introNote', 'introNote'],
			['inputsHeader', 'inputsHeader'],
			['resultsHeader', 'resultsHeader'],
			['lblRaceTime', 'lblRaceTime'],
			['lblLapTime', 'lblLapTime'],
			['lblFuelPerLap', 'lblFuelPerLap'],
			['lblTankCapacity', 'lblTankCapacity'],
			['sufHours', 'sufHours'],
			['sufMinutes', 'sufMinutes'],
			['sufLapMin', 'sufLapMin'],
			['sufLapSec', 'sufLapSec'],
			['sufFuelPerLap', 'sufFuelPerLap'],
			['sufTankCapacity', 'sufTankCapacity'],
			['calculateBtn', 'btnCalculate'],
			['resetBtn', 'btnReset'],
			['lblTotalLaps', 'lblTotalLaps'],
			['lblPitStops', 'lblPitStops'],
			['lblMinFuel', 'lblMinFuel'],
			['lblSafeFuel', 'lblSafeFuel'],
			['lblLapsPerStint', 'lblLapsPerStint'],
			['lblLastStintLaps', 'lblLastStintLaps'],
			['lblStintFuelList', 'lblStintFuelList'],
			['lblLastStintFuel', 'lblLastStintFuel'],
			['formulaNote', 'formulaNote']
		];
		for (const [id, key] of map) {
			const node = document.getElementById(id);
			if (node && t[key] !== undefined) node.textContent = t[key];
		}
		// placeholders
		const raceHours = document.getElementById('raceHours');
		const raceMinutes = document.getElementById('raceMinutes');
		const lapMinutes = document.getElementById('lapMinutes');
		const lapSeconds = document.getElementById('lapSeconds');
		const fuelPerLap = document.getElementById('fuelPerLap');
		const tankCapacity = document.getElementById('tankCapacity');
		if (raceHours) raceHours.placeholder = t.placeholderHours;
		if (raceMinutes) raceMinutes.placeholder = t.placeholderMinutes;
		if (lapMinutes) lapMinutes.placeholder = t.placeholderLapMin;
		if (lapSeconds) lapSeconds.placeholder = t.placeholderLapSec;
		if (fuelPerLap) fuelPerLap.placeholder = locale === 'zh' ? '例如 2.75' : 'e.g. 2.75';

		if (tankCapacity) tankCapacity.placeholder = locale === 'zh' ? '例如 100' : 'e.g. 100';
		// dropdown value sync
		const extra = locale === 'zh' ? {
			raceMode: '\u6bd4\u8d5b\u7c7b\u578b', raceLaps: '\u6bd4\u8d5b\u5708\u6570', buffer: '\u5b89\u5168\u4f59\u91cf',
			time: '\u8ba1\u65f6\u8d5b', laps: '\u5708\u6570\u8d5b', lapUnit: '\u5708',
			strategy: '\u5b8c\u6574\u5206\u6bb5\u7b56\u7565', safe: '\u5b89\u5168\u603b\u6cb9\u91cf\uff08\u542b\u4f59\u91cf\uff09',
			formula: '\u8bf4\u660e\uff1a\u8ba1\u65f6\u8d5b\u4f1a\u8ba1\u5165\u65f6\u95f4\u5f52\u96f6\u65f6\u6b63\u5728\u8fdb\u884c\u7684\u6700\u540e\u4e00\u5708\u3002'
		} : {
			raceMode: 'Race type', raceLaps: 'Race laps', buffer: 'Safety margin',
			time: 'Timed race', laps: 'Lap race', lapUnit: 'laps',
			strategy: 'Full stint strategy', safe: 'Safe total fuel (with margin)',
			formula: 'Note: Timed races include the lap in progress when the clock expires.'
		};
		$('lblRaceMode').textContent = extra.raceMode;
		$('lblRaceLaps').textContent = extra.raceLaps;
		$('lblBufferLaps').textContent = extra.buffer;
		$('sufRaceLaps').textContent = extra.lapUnit;
		$('sufBufferLaps').textContent = extra.lapUnit;
		$('lblStintFuelList').textContent = extra.strategy;
		$('formulaNote').textContent = extra.formula;
		$('lblSafeFuel').textContent = extra.safe;
		const modeTabs = document.querySelectorAll('[data-race-mode]');
		modeTabs[0].textContent = extra.time;
		modeTabs[1].textContent = extra.laps;
		const sel = document.getElementById('langSelect');
		if (sel) sel.value = locale;
		const langTrigger = document.getElementById('langTrigger');
		if (langTrigger) langTrigger.textContent = locale === 'zh' ? '\u4e2d\u6587' : 'English';
		document.querySelectorAll('[data-locale]').forEach((option) => {
			const selected = option.dataset.locale === locale;
			option.classList.toggle('selected', selected);
			option.setAttribute('aria-selected', String(selected));
		});
		document.querySelectorAll('.stepper-button').forEach((button) => {
			button.setAttribute('aria-label', button.dataset.action === 'increase'
				? (locale === 'zh' ? '\u589e\u52a0' : 'Increase')
				: (locale === 'zh' ? '\u51cf\u5c11' : 'Decrease'));
		});

		applyBopTranslations(locale);
	}
	function toNumber(value) {
		if (value === '' || value === null || value === undefined) return NaN;
		return Number(value);
	}

	function clampNonNegative(n) {
		return isFinite(n) && n >= 0 ? n : NaN;
	}

	function toSeconds(mins, secs) {
		return mins * 60 + secs;
	}

	function roundUp(value, decimals) {
		if (!isFinite(value)) return NaN;
		const factor = Math.pow(10, decimals);
		return Math.ceil(value * factor - 1e-10) / factor;
	}

	function round(value, decimals) {
		if (!isFinite(value)) return NaN;
		const factor = Math.pow(10, decimals);
		return Math.round((value + Number.EPSILON) * factor) / factor;
	}

	function formatLiters(n) {
		if (!isFinite(n)) return '-';
		const t = I18N[currentLocale] || I18N.zh;
		return currentLocale === 'zh' ? `${n.toFixed(2)} ${t.unitLiter}` : `${n.toFixed(2)} ${t.unitLiter}`;
	}

	function $(id) { return document.getElementById(id); }

	// ---- easing + animation helpers ----
	function easeOutCubic(t) {
		return 1 - Math.pow(1 - t, 3);
	}

	function parseNumericFromText(text) {
		if (!text || text === '-') return NaN;
		const m = String(text).match(/-?\d+(?:\.\d+)?/);
		return m ? Number(m[0]) : NaN;
	}

	function animateNumber(elNode, toValue, options) {
		const { duration = 500, decimals = 0, formatter = (v) => String(v) } = options || {};
		const fromText = elNode.textContent;
		const fromValue = parseNumericFromText(fromText);
		if (!isFinite(fromValue)) {
			// no previous numeric value, set immediately
			elNode.textContent = formatter(Number(toValue));
			bumpCard(elNode);
			return;
		}
		const start = performance.now();
		function frame(now) {
			const t = Math.min(1, (now - start) / duration);
			const e = easeOutCubic(t);
			const current = fromValue + (toValue - fromValue) * e;
			const rounded = decimals > 0 ? Number(current.toFixed(decimals)) : Math.round(current);
			elNode.textContent = formatter(rounded);
			if (t < 1) {
				requestAnimationFrame(frame);
			} else {
				elNode.textContent = formatter(toValue);
				bumpCard(elNode);
			}
		}
		requestAnimationFrame(frame);
	}

	function bumpCard(valueEl) {
		const card = valueEl.closest('.result-item');
		if (!card) return;
		card.classList.remove('bump');
		// force reflow to restart animation
		void card.offsetWidth;
		card.classList.add('bump');
	}

	const el = {
		raceHours: $('raceHours'),
		raceMinutes: $('raceMinutes'),
		raceMode: $('raceMode'),
		raceLaps: $('raceLaps'),
		raceLapsGroup: $('raceLapsGroup'),
		bufferLaps: $('bufferLaps'),
		formError: $('formError'),
		lapMinutes: $('lapMinutes'),
		lapSeconds: $('lapSeconds'),
		fuelPerLap: $('fuelPerLap'),
		tankCapacity: $('tankCapacity'),
		calculateBtn: $('calculateBtn'),
		resetBtn: $('resetBtn'),
		totalLaps: $('totalLaps'),
		pitStops: $('pitStops'),
		minFuel: $('minFuel'),
		safeFuel: $('safeFuel'),
		lapsPerStint: $('lapsPerStint'),
		lastStintLaps: $('lastStintLaps'),
		stintFuelList: $('stintFuelList'),
		lastStintFuel: $('lastStintFuel')
	};

	function readInputs() {
		// Time fields default to 0 when empty
		const raceHours = clampNonNegative(toNumber(el.raceHours.value === '' ? 0 : el.raceHours.value));
		const raceMinutes = clampNonNegative(toNumber(el.raceMinutes.value === '' ? 0 : el.raceMinutes.value));
		const raceLaps = clampNonNegative(toNumber(el.raceLaps.value));
		const lapMinutes = clampNonNegative(toNumber(el.lapMinutes.value === '' ? 0 : el.lapMinutes.value));
		const lapSeconds = clampNonNegative(toNumber(el.lapSeconds.value === '' ? 0 : el.lapSeconds.value));
		const fuelPerLap = clampNonNegative(toNumber(el.fuelPerLap.value));
		const tankCapacity = clampNonNegative(toNumber(el.tankCapacity.value));
		const bufferLaps = clampNonNegative(toNumber(el.bufferLaps.value === '' ? 0 : el.bufferLaps.value));

		return { raceHours, raceMinutes, raceLaps, lapMinutes, lapSeconds, fuelPerLap, tankCapacity, bufferLaps };
	}

	function compute() {
		const { raceHours, raceMinutes, raceLaps, lapMinutes, lapSeconds, fuelPerLap, tankCapacity, bufferLaps } = readInputs();

		// Basic validation
		const raceIsValid = el.raceMode.value === 'laps'
			? Number.isInteger(raceLaps) && raceLaps > 0
			: isFinite(raceHours) && isFinite(raceMinutes) && ((raceHours * 60) + raceMinutes > 0);
		if (!raceIsValid || !isFinite(lapMinutes) || !isFinite(lapSeconds) || !isFinite(fuelPerLap) || !isFinite(tankCapacity) || !Number.isInteger(bufferLaps)) {
			showError(currentLocale === 'zh' ? '\u8bf7\u5b8c\u6574\u586b\u5199\u5fc5\u586b\u9879\uff0c\u5e76\u786e\u4fdd\u8f93\u5165\u4e3a\u6709\u6548\u7684\u6b63\u6570\u3002' : 'Complete all required fields with valid positive values.');
			setOutputsInvalid();
			return;
		}
		showError('');

		const raceTotalSeconds = (raceHours * 3600) + (raceMinutes * 60);
		const lapTimeSeconds = toSeconds(lapMinutes, lapSeconds);

		if ((el.raceMode.value === 'time' && (raceTotalSeconds <= 0 || lapTimeSeconds <= 0)) || fuelPerLap <= 0 || tankCapacity <= 0) {
			setOutputsInvalid();
			showError(currentLocale === 'zh' ? '\u5355\u5708\u65f6\u95f4\u3001\u6bcf\u5708\u6cb9\u8017\u548c\u6cb9\u7bb1\u5bb9\u91cf\u5fc5\u987b\u5927\u4e8e 0\u3002' : 'Lap time, fuel per lap and tank capacity must be greater than 0.');
			return;
		}

		// Timed races include the lap that is in progress when the clock expires.
		const totalLaps = el.raceMode.value === 'laps'
			? raceLaps
			: Math.ceil(raceTotalSeconds / lapTimeSeconds);
		if (totalLaps <= 0) {
			setOutputsInvalid();
			return;
		}

		const plannedLaps = totalLaps + bufferLaps;
		// Stint laps per full tank
		const lapsPerStint = tankCapacity > 0 ? Math.floor(tankCapacity / fuelPerLap) : 0;
		if (lapsPerStint <= 0) {
			// Cannot complete any lap with current per-lap fuel usage and tank capacity
			el.totalLaps.textContent = String(totalLaps);
			el.pitStops.textContent = (I18N[currentLocale] || I18N.zh).cannotCompleteLap;
			const minFuelLiters = roundUp(totalLaps * fuelPerLap, 2);
			el.minFuel.textContent = formatLiters(minFuelLiters);
			el.safeFuel.textContent = formatLiters(roundUp(plannedLaps * fuelPerLap, 2));
			el.lapsPerStint.textContent = '-';
			el.lastStintLaps.textContent = '-';
			el.stintFuelList.textContent = '-';
			el.lastStintFuel.textContent = '-';
			return;
		}

		// Stints breakdown
		const fullStints = Math.floor(plannedLaps / lapsPerStint);
		const remainderLaps = plannedLaps % lapsPerStint;
		const hasRemainder = remainderLaps > 0;
		const totalStints = hasRemainder ? (fullStints + 1) : fullStints;
		const pitStops = Math.max(0, totalStints - 1);

		// Last stint laps logic
		let lastStintLaps = 0;
		if (plannedLaps <= lapsPerStint) {
			lastStintLaps = plannedLaps; // no refuel scenario
		} else if (hasRemainder) {
			lastStintLaps = remainderLaps;
		} else {
			lastStintLaps = lapsPerStint; // exact division: final stint is a full stint
		}

		// Fuel figures
		const minFuelLiters = roundUp(totalLaps * fuelPerLap, 2);
		const safeFuelLiters = roundUp(plannedLaps * fuelPerLap, 2);
		const lastStintFuelLiters = roundUp(lastStintLaps * fuelPerLap, 2);

		// Only show the fuel consumption for the first stint (前一段)
		const strategy = Array.from({ length: totalStints }, (_, index) => {
			const laps = index === totalStints - 1 ? lastStintLaps : lapsPerStint;
			const fuel = roundUp(laps * fuelPerLap, 2);
			const label = currentLocale === 'zh' ? `\u7b2c ${index + 1} \u6bb5` : `Stint ${index + 1}`;
			return `${label}: ${laps} ${currentLocale === 'zh' ? '\u5708' : 'laps'} / ${formatLiters(fuel)}`;
		}).join('\n');

		// Render with easing animations
		animateNumber(el.totalLaps, totalLaps, { duration: 500, decimals: 0, formatter: (v) => String(v) });
		animateNumber(el.pitStops, pitStops, { duration: 500, decimals: 0, formatter: (v) => String(v) });
		animateNumber(el.minFuel, minFuelLiters, { duration: 600, decimals: 2, formatter: (v) => formatLiters(Number(v)) });
		animateNumber(el.safeFuel, safeFuelLiters, { duration: 600, decimals: 2, formatter: (v) => formatLiters(Number(v)) });
		animateNumber(el.lapsPerStint, lapsPerStint, { duration: 500, decimals: 0, formatter: (v) => String(v) });
		animateNumber(el.lastStintLaps, lastStintLaps, { duration: 500, decimals: 0, formatter: (v) => String(v) });
		el.stintFuelList.textContent = strategy;
		animateNumber(el.lastStintFuel, lastStintFuelLiters, { duration: 600, decimals: 2, formatter: (v) => formatLiters(Number(v)) });
	}

	function setOutputsInvalid() {
		el.totalLaps.textContent = '-';
		el.pitStops.textContent = '-';
		el.minFuel.textContent = '-';
		el.safeFuel.textContent = '-';
		el.lapsPerStint.textContent = '-';
		el.lastStintLaps.textContent = '-';
		el.stintFuelList.textContent = '-';
		el.lastStintFuel.textContent = '-';
	}

	function showError(message) {
		el.formError.textContent = message;
		el.formError.hidden = !message;
	}

	function updateMode() {
		const isLapRace = el.raceMode.value === 'laps';
		document.querySelectorAll('[data-race-mode]').forEach((tab) => {
			const isActive = tab.dataset.raceMode === el.raceMode.value;
			tab.classList.toggle('active', isActive);
			tab.setAttribute('aria-selected', String(isActive));
			tab.tabIndex = isActive ? 0 : -1;
		});
		el.raceLapsGroup.hidden = !isLapRace;
		const timeGroup = document.getElementById('lblRaceTime').closest('.field-group');
		timeGroup.hidden = isLapRace;
		if (hasEnoughInput()) compute();
	}

	function hasEnoughInput() {
		const modeReady = el.raceMode.value === 'laps'
			? Number(el.raceLaps.value) > 0
			: ((Number(el.raceHours.value) * 60) + Number(el.raceMinutes.value) > 0 && (Number(el.lapMinutes.value) * 60) + Number(el.lapSeconds.value) > 0);
		return modeReady && Number(el.fuelPerLap.value) > 0 && Number(el.tankCapacity.value) > 0;
	}


	const BOP_API_URL = 'https://api3.lowfuelmotorsport.com/api/hotlaps/getAccBop';
	let bopData = [];
	const BOP_CACHE_KEY = 'lfm-bop-cache-v1';
	const BOP_CACHE_TTL = 7 * 24 * 60 * 60 * 1000;
	let activeBopClass = 'GT3';
	let activeBopTrack = '';

	function getBopText(locale = currentLocale) {
		return locale === 'zh' ? {
			title: 'ACC BOP \u5217\u8868',
			intro: 'Low Fuel Motorsport \u5f53\u524d\u914d\u91cd\u6570\u636e',
			refresh: '\u5237\u65b0\u6570\u636e',
			search: '\u641c\u7d22\u5f53\u524d\u8d5b\u9053\u8f66\u8f86',
			selectTrack: '\u9009\u62e9\u8d5b\u9053',
			meta: (version, date) => `BOP \u7248\u672c ${version} \u00b7 \u751f\u6548\u65f6\u95f4 ${date}`,
			selectPrompt: '\u8bf7\u5148\u9009\u62e9\u8d5b\u9053\uff0c\u518d\u67e5\u770b\u5bf9\u5e94\u8f66\u8f86 BOP\u3002',
			loading: '\u6b63\u5728\u52a0\u8f7d BOP \u6570\u636e\u2026',
			error: 'BOP \u6570\u636e\u52a0\u8f7d\u5931\u8d25\uff0c\u8bf7\u7a0d\u540e\u91cd\u8bd5\u3002',
			empty: '\u6ca1\u6709\u627e\u5230\u5339\u914d\u7684 BOP \u6570\u636e\u3002',
			rows: (count) => `\u5171 ${count} \u6761\u6570\u636e`,
			headers: ['\u8f66\u8f86', '\u5e74\u4efd', '\u9650\u6d41\u5668', '\u914d\u91cd', '\u53d8\u5316', '\u7248\u672c'],
			source: '\u6570\u636e\u6765\u6e90\uff1a'
		} : {
			title: 'ACC BOP List',
			intro: 'Current Low Fuel Motorsport ballast data',
			refresh: 'Refresh data',
			search: 'Search cars on this track',
			selectTrack: 'Select track',
			meta: (version, date) => `BOP version ${version} \u00b7 Active since ${date}`,
			selectPrompt: 'Select a track to view its vehicle BOP.',
			loading: 'Loading BOP data\u2026',
			error: 'Unable to load BOP data. Please try again later.',
			empty: 'No matching BOP data found.',
			rows: (count) => `${count} entries`,
			headers: ['Car', 'Year', 'Restrictor', 'Ballast', 'Change', 'Version'],
			source: 'Data source: '
		};
	}

	function applyBopTranslations(locale) {
		const t = getBopText(locale);
		$('bopTitle').textContent = t.title;
		$('bopIntro').textContent = t.intro;
		$('bopRefresh').textContent = t.refresh;
		$('bopSearch').placeholder = t.search;
		$('bopSearchLabel').textContent = t.search;
		$('bopSourceLabel').textContent = t.source;
		$('bopTrackLabel').textContent = t.selectTrack;
		if (!activeBopTrack) $('bopTrackTrigger').textContent = t.selectTrack;
		['Car', 'Year', 'Restrictor', 'Ballast', 'Change', 'Version'].forEach((key, index) => {
			$('bopHead' + key).textContent = t.headers[index];
		});
		if (bopData.length && activeBopTrack) {
			renderBopTable();
		} else if (bopData.length) {
			$('bopStatus').textContent = t.selectPrompt;
		}
	}

	function formatSignedValue(value, unit = '') {
		const number = Number(value || 0);
		const sign = number > 0 ? '+' : '';
		return `${sign}${number}${unit}`;
	}

	function renderBopTrackTabs() {
		const container = $('bopTrackTabs');
		const trigger = $('bopTrackTrigger');
		container.textContent = '';
		const fragment = document.createDocumentFragment();
		for (const track of bopData) {
			const button = document.createElement('button');
			const selected = track.track_name === activeBopTrack;
			button.type = 'button';
			button.role = 'option';
			button.dataset.bopTrack = track.track_name;
			button.textContent = track.track_name;
			button.classList.toggle('active', selected);
			button.setAttribute('aria-selected', String(selected));
			button.addEventListener('click', () => {
				activeBopTrack = track.track_name;
				$('bopSearch').disabled = false;
				$('bopSearch').value = '';
				container.querySelectorAll('[data-bop-track]').forEach((item) => {
					const isActive = item.dataset.bopTrack === activeBopTrack;
					item.classList.toggle('active', isActive);
					item.setAttribute('aria-selected', String(isActive));
				});
				trigger.textContent = activeBopTrack;
				container.hidden = true;
				trigger.setAttribute('aria-expanded', 'false');
				renderBopTable();
			});
			fragment.appendChild(button);
		}
		container.appendChild(fragment);
		trigger.textContent = activeBopTrack || getBopText().selectTrack;
	}


	function renderBopTable() {
		const query = $('bopSearch').value.trim().toLowerCase();
		const track = bopData.find((item) => item.track_name === activeBopTrack);
		const cars = track && track.bop && Array.isArray(track.bop[activeBopClass])
			? track.bop[activeBopClass]
			: [];
		const rows = cars
			.filter((car) => !query || String(car.car_name || '').toLowerCase().includes(query))
			.map((car) => ({ track, car }));
		$('bopTrackMeta').textContent = track
			? getBopText().meta(track.bop_version || '\u2014', track.active_since || '\u2014')
			: '';

		const body = $('bopTableBody');
		body.textContent = '';
		const fragment = document.createDocumentFragment();
		for (const { track, car } of rows) {
			const row = document.createElement('tr');
			const values = [
				car.car_name || '\u2014',
				car.car_year || '\u2014',
				car.restrictor === undefined ? '\u2014' : formatSignedValue(car.restrictor, '%'),
				formatSignedValue(car.ballast, ' kg'),
				formatSignedValue(car.ballast_change, ' kg'),
				track.bop_version || '\u2014'
			];
			values.forEach((value, index) => {
				const cell = document.createElement('td');
				cell.textContent = value;
				if (index === 3 || index === 4) {
					const numeric = Number(index === 3 ? car.ballast : car.ballast_change);
					cell.className = numeric > 0 ? 'bop-positive' : numeric < 0 ? 'bop-negative' : 'bop-neutral';
				}
				if (index === 5 && track.active_since) cell.title = track.active_since;
				row.appendChild(cell);
			});
			fragment.appendChild(row);
		}
		body.appendChild(fragment);
		$('bopTableWrap').hidden = rows.length === 0;
		$('bopStatus').textContent = rows.length ? getBopText().rows(rows.length) : getBopText().empty;
		$('bopStatus').classList.remove('error');
	}

	async function loadBopData(force = false) {
		const refresh = $('bopRefresh');
		refresh.disabled = true;
		$('bopStatus').textContent = getBopText().loading;
		$('bopStatus').classList.remove('error');
		if (!force) {
			try {
				const cached = JSON.parse(safeStorageGet(BOP_CACHE_KEY) || 'null');
				const isFresh = cached && Date.now() - Number(cached.timestamp) < BOP_CACHE_TTL;
				if (isFresh && Array.isArray(cached.data)) {
					bopData = cached.data;
					activeBopTrack = '';
					renderBopTrackTabs();
					$('bopTableWrap').hidden = true;
					$('bopSearch').disabled = true;
					$('bopStatus').textContent = getBopText().selectPrompt;
					refresh.disabled = false;
					return;
				}
			} catch (error) {
				safeStorageRemove(BOP_CACHE_KEY);
			}
		}
		try {
			const response = await fetch(BOP_API_URL, { cache: 'no-store' });
			if (!response.ok) throw new Error(`HTTP ${response.status}`);
			const data = await response.json();
			if (!Array.isArray(data)) throw new Error('Invalid BOP response');
			bopData = data;
			try {
				safeStorageSet(BOP_CACHE_KEY, JSON.stringify({ timestamp: Date.now(), data: bopData }));
			} catch (error) {
				console.warn('[BOP] Unable to save cache', error);
			}
			if (!bopData.some((track) => track.track_name === activeBopTrack)) activeBopTrack = '';
			renderBopTrackTabs();
			if (activeBopTrack) {
				renderBopTable();
			} else {
				$('bopTableWrap').hidden = true;
				$('bopSearch').disabled = true;
				$('bopStatus').textContent = getBopText().selectPrompt;
			}
		} catch (error) {
			console.error('[BOP] Failed to load data', error);
			$('bopTableWrap').hidden = true;
			$('bopStatus').textContent = getBopText().error;
			$('bopStatus').classList.add('error');
		} finally {
			refresh.disabled = false;
		}
	}

	function setupBopTable() {
		const trackTrigger = $('bopTrackTrigger');
		const trackMenu = $('bopTrackTabs');
		trackTrigger.addEventListener('click', () => {
			const willOpen = trackMenu.hidden;
			trackMenu.hidden = !willOpen;
			trackTrigger.setAttribute('aria-expanded', String(willOpen));
		});
		document.addEventListener('click', (event) => {
			if (!event.target.closest('.bop-track-picker')) {
				trackMenu.hidden = true;
				trackTrigger.setAttribute('aria-expanded', 'false');
			}
		});
		document.querySelectorAll('[data-bop-class]').forEach((tab) => {
			tab.addEventListener('click', () => {
				activeBopClass = tab.dataset.bopClass;
				document.querySelectorAll('[data-bop-class]').forEach((item) => {
					const selected = item === tab;
					item.classList.toggle('active', selected);
					item.setAttribute('aria-selected', String(selected));
				});
				if (activeBopTrack) renderBopTable();
			});
		});
		document.querySelector('[data-bop-class="GT3"]').classList.add('active');
		$('bopSearch').addEventListener('input', () => { if (activeBopTrack) renderBopTable(); });
		$('bopRefresh').addEventListener('click', () => loadBopData(true));
		loadBopData();
	}


	function setupLanguageMenu() {
		const trigger = document.getElementById('langTrigger');
		const menu = document.getElementById('langMenu');
		const options = Array.from(menu.querySelectorAll('[data-locale]'));
		const close = () => {
			menu.hidden = true;
			trigger.setAttribute('aria-expanded', 'false');
		};
		trigger.addEventListener('click', () => {
			const willOpen = menu.hidden;
			menu.hidden = !willOpen;
			trigger.setAttribute('aria-expanded', String(willOpen));
			if (willOpen) {
				const selectedOption = options.find((option) => option.classList.contains('selected'));
				if (selectedOption) selectedOption.focus();
			}
		});
		options.forEach((option) => {
			option.addEventListener('click', () => {
				const locale = option.dataset.locale === 'en' ? 'en' : 'zh';
				$('langSelect').value = locale;
				safeStorageSet('locale', locale);
				applyTranslations(locale);
				if (hasEnoughInput()) compute();
				close();
			});
		});
		document.addEventListener('click', (event) => {
			if (!document.querySelector('.lang-control').contains(event.target)) close();
		});
		document.addEventListener('keydown', (event) => {
			if (event.key === 'Escape') close();
		});
	}

	function setupNumberSteppers() {
		document.querySelectorAll('.inputs input[type="number"]').forEach((input) => {
			if (input.id === 'fuelPerLap') input.step = '0.1';
			if (input.id === 'tankCapacity') input.step = '1';
			const controls = document.createElement('div');
			controls.className = 'stepper-controls';
			for (const [action, symbol] of [['decrease', '\u2212'], ['increase', '+']]) {
				const button = document.createElement('button');
				button.type = 'button';
				button.className = 'stepper-button';
				button.dataset.action = action;
				button.textContent = symbol;
				button.setAttribute('aria-label', currentLocale === 'zh' ? (action === 'increase' ? '\u589e\u52a0' : '\u51cf\u5c11') : action);
				button.addEventListener('click', () => {
					if (action === 'increase') {
						input.stepUp();
					} else {
						input.stepDown();
					}
					input.dispatchEvent(new Event('input', { bubbles: true }));
					input.focus();
				});
				controls.appendChild(button);
			}
			input.closest('.field').appendChild(controls);
		});
	}
	function wire() {
		setupLanguageMenu();
		setupNumberSteppers();
		const modeTabs = Array.from(document.querySelectorAll('[data-race-mode]'));
		modeTabs.forEach((tab, index) => {
			tab.addEventListener('click', () => {
				el.raceMode.value = tab.dataset.raceMode;
				updateMode();
			});
			tab.addEventListener('keydown', (event) => {
				if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
				event.preventDefault();
				const offset = event.key === 'ArrowRight' ? 1 : -1;
				const next = modeTabs[(index + offset + modeTabs.length) % modeTabs.length];
				next.click();
				next.focus();
			});
		});
		el.calculateBtn.addEventListener('click', compute);
		el.resetBtn.addEventListener('click', () => {
			el.raceHours.value = '0';
			el.raceLaps.value = '';
			el.bufferLaps.value = '2';
			el.raceMinutes.value = '0';
			el.lapMinutes.value = '0';
			el.lapSeconds.value = '0';
			el.fuelPerLap.value = '';
			el.tankCapacity.value = '';
			showError('');
			setOutputsInvalid();
		});
		document.querySelectorAll('.inputs input').forEach((input) => {
			input.addEventListener('input', () => {
				showError('');
				if (hasEnoughInput()) compute();
			});
			input.addEventListener('keydown', (event) => { if (event.key === 'Enter') compute(); });
		});
		try {
			setupBopTable();
		} catch (error) {
			console.error('[BOP] Initialization failed', error);
			const status = document.getElementById('bopStatus');
			if (status) status.textContent = getBopText().error;
		}
	}

	// Initialize
	const initialLocale = detectLocale();
	applyTranslations(initialLocale);
	wire();
	setOutputsInvalid();
	updateMode();
})();


