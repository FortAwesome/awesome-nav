//! <awesome-nav>
const css = String.raw;

class AwesomeNav extends HTMLElement {
	static tagName = "awesome-nav";
	static #init = false;
	static classes = {
		srOnly: "awesome-sr-only",
		spacer: "awesome-spacer",
		primary: "awesome-nav-primary",
	};
	static attrs = {
		label: "data-tooltip"
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

${this.tagName} a[href][${this.attrs.label}] {
	position: relative;

	&:after {
		position: absolute;
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
		opacity: 0;
		transition: 600ms opacity;
	}

	&:is(:hover, :focus-visible) {
		/* center align */
		&:after {
			content: attr(${this.attrs.label});
			bottom: .35em;
			left: 50%;
			translate: -50% 100%;
			z-index: 999;
			opacity: 1;
		}

		&:before {
			/* arrow */
			content: "";
			position: absolute;
			bottom: -.25em;
			left: 50%;
			translate: -50% -100%;
			border-left: .5em solid transparent;
			border-right: .5em solid transparent;
			border-bottom: .5em solid var(--awesome-nav-tooltip-bg);
		}
	
		/* right align */
		&.awesome-nav-blog:last-child {
			&:after {
				left: auto;
				right: 0;
				translate: 0 100%;
				margin-inline-start: 0;
			}
	
			&:before {
				left: auto;
				right: .9em;
			}
		}
	
		/* left align */
		&:first-child {
			&:after { 
				left: 0;
				right: auto;
				translate: 0 100%;
			}
	
			&:before {
				left: 1.9em;
				right: auto;
			}
		}
	}
}

/* hide non-primary tab text */
${this.tagName}:not(:has(.${this.classes.primary})) a[href]:not(:first-child) .${this.classes.srOnly},
${this.tagName}:has(.${this.classes.primary}) a[href]:not(.${this.classes.primary}) .${this.classes.srOnly} {
	position: absolute;
	height: 1px;
	width: 1px;
	overflow: hidden;
	clip: rect(1px, 1px, 1px, 1px);
	opacity: 0;
}
`;
	}

	getLogoHtml() {
		// need a {key}Link getter
		return {
			build: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20"><path fill="currentColor" d="M10 2a7 7 0 0 1 7 7c0 3.2-2.8 6.3-5.2 7.5l.6 1.3a.8.8 0 0 1-.7 1.2H8.3a.8.8 0 0 1-.7-1.2l.6-1.3C5.8 15.3 3 12.2 3 9a7 7 0 0 1 7-7m-.3 3.1q-.1-.7-.8-.6-1.3.3-2.2 1.2-.9 1-1.2 2.2A.8.8 0 0 0 7 8q.1-.7.8-1.3.6-.6 1.3-.8t.6-.9"/></svg>`,
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

		// Inject Build icon
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
		let textNodes = Array.from(node.childNodes).filter(c => c.nodeType === 3);
		w.append(...textNodes);
		w.classList.add(AwesomeNav.classes.srOnly);
		node.setAttribute(AwesomeNav.attrs.label, textNodes.map(c => c.textContent).join(", "))
		node.append(w);
	}

	get buildLink() {
		return this.querySelector(".awesome-nav-build");
	}
	
	get podcastLink() {
		return this.querySelector(".awesome-nav-podcast");
	}
}

if(!(new URL(import.meta.url)).searchParams.has("nodefine")) {
	AwesomeNav.define();
}
