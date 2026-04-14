//! <awesome-nav>
const css = String.raw;

class AwesomeNav extends HTMLElement {
	static tagName = "awesome-nav";
	static #init = false;
	static classes = {
		srOnly: "awesome-sr-only",
		spacer: "awesome-spacer",
	}

	static define(registry = window.customElements) {
		if(!registry.get(this.tagName)) {
			registry.define(this.tagName, this);
		}
	}

	static getGlobalStyle() {
		return css`
.${this.classes.spacer} {
	flex-grow: 1;
}

${this.tagName}:not(:has(.awesome-nav-primary)) a[href]:not(:first-child),
${this.tagName}:has(.awesome-nav-primary) a[href]:not(.awesome-nav-primary) {
	.${this.classes.srOnly} {
		position: absolute;
		height: 1px;
		width: 1px;
		overflow: hidden;
		clip: rect(1px, 1px, 1px, 1px);
		opacity: 0;
		transition: 600ms opacity;
	}

	&:is(:hover, :focus-visible) {
		position: relative;
	
		.${this.classes.srOnly} {
			position: absolute;
			bottom: .5em;
			left: 50%;
			translate: -50% 100%;
			z-index: 999;
			height: auto;
			width: auto;
			overflow: visible;
			clip: auto;
			color: var(--awesome-nav-tooltip-fg);
			background-color: var(--awesome-nav-tooltip-bg);
			border-radius: .25em;
			font-size: 0.75rem; /* 12px /16 */
			font-family: system-ui, sans-serif;
			letter-spacing: 0;
			text-transform: none;
			font-weight: 400;
			padding: .25em .5em;
			white-space: nowrap;
			opacity: 1;
	
			&:before {
				content: "";
				position: absolute;
				top: 0;
				left: 50%;
				translate: -50% -100%;
				border-left: .5em solid transparent;
				border-right: .5em solid transparent;
				border-bottom: .5em solid var(--awesome-nav-tooltip-bg);
			}
		}
	
		/* right align */
		&.awesome-nav-blog:last-child .${this.classes.srOnly} {
			left: auto;
			right: 0;
			translate: 0 100%;
			margin-inline-start: 0;
	
			&:before {
				left: auto;
				right: 1em;
			}
		}
	
		/* left align */
		&:first-child .${this.classes.srOnly} {
			left: 0;
			right: auto;
			translate: 0 100%;
	
			&:before {
				left: 2.25em;
				right: auto;
			}
		}
	}
}
`;
	}

	getLogoHtml() {
		return {
			build: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20"><path fill="currentColor" d="M10 2a7 7 0 0 1 7 7c0 3.2-2.8 6.3-5.2 7.5l.6 1.3a.8.8 0 0 1-.7 1.2H8.3a.8.8 0 0 1-.7-1.2l.6-1.3C5.8 15.3 3 12.2 3 9a7 7 0 0 1 7-7m-.3 3.1q-.1-.7-.8-.6-1.3.3-2.2 1.2-.9 1-1.2 2.2A.8.8 0 0 0 7 8q.1-.7.8-1.3.6-.6 1.3-.8t.6-.9"/></svg>`,
			font: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M155.7 160a52 52 0 1 0-59.7-3v419h64v-64h373.6a26.4 26.4 0 0 0 24.1-37.1L496 336l61.7-138.9a26.4 26.4 0 0 0-24.1-37.1z"/></svg>`,
			web: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M372.2 116C372.2 136.9 359.8 155 342 163.2L448 256L552.4 235.1C547.1 227.4 544 218 544 208C544 181.5 565.5 160 592 160C618.5 160 640 181.5 640 208C640 234 619.4 255.1 593.6 256L481 506.3C470.7 529.3 447.8 544 422.6 544L217.4 544C192.2 544 169.4 529.2 159 506.3L46.4 256C20.6 255.1 0 234 0 208C0 181.5 21.5 160 48 160C74.5 160 96 181.5 96 208C96 218.1 92.9 227.4 87.6 235.1L192 256L298.1 163.1C280.4 154.8 268.1 136.8 268.1 116C268.1 87.3 291.4 64 320.1 64C348.8 64 372.1 87.3 372.1 116z"/></svg>`,
			podcast: false, // optional
			blog: false, // optional
		}
	}

	static connected() {
		if(this.#init) {
			return;
		}

		this.#init = true;
		let sheet = new CSSStyleSheet();
		sheet.replaceSync(this.getGlobalStyle());
		document.adoptedStyleSheets.push(sheet);
	}

	hasExistingIcon(el) {
		return Boolean(el.querySelector("svg,wa-icon,i[class*='fa-']"));
	}

	connectedCallback() {
		if (!("replaceSync" in CSSStyleSheet.prototype) || this.shadowRoot) {
			return;
		}

		AwesomeNav.connected();

		let logos = this.getLogoHtml();
		for(let el of this.querySelectorAll(":scope > nav > a[href]")) {
			this.wrapInnerText(el);
		}

		for(let [name, icon] of Object.entries(logos)) {
			let linkEl = this[name + "Link"];
			if(icon && !this.hasExistingIcon(linkEl)) {
				linkEl.prepend(this.createElement(icon))
			}
		}

		this.podcastLink?.insertAdjacentElement("beforebegin", this.getSpacer());
	}

	getSpacer() {
		let d = document.createElement("div");
		d.classList.add(AwesomeNav.classes.spacer);
		return d;
	}

	createElement(html) {
		let tmpl = document.createElement("template");
		tmpl.innerHTML = html;
		return tmpl.content.firstElementChild;
	}

	wrapInnerText(node) {
		let w = document.createElement("span");
		w.append(...Array.from(node.childNodes).filter(c => c.nodeType === 3));
		w.classList.add(AwesomeNav.classes.srOnly);
		node.append(w);
	}

	get buildLink() {
		return this.querySelector(".awesome-nav-build");
	}

	get webLink() {
		return this.querySelector(".awesome-nav-web");
	}

	get fontLink() {
		return this.querySelector(".awesome-nav-font");
	}
	
	get podcastLink() {
		return this.querySelector(".awesome-nav-podcast");
	}

	get blogLink() {
		return this.querySelector(".awesome-nav-blog");
	}
}

if(!(new URL(import.meta.url)).searchParams.has("nodefine")) {
	AwesomeNav.define();
}
