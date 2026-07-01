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

	static connected() {
		if(this.#init) {
			return;
		}

		this.#init = true;
		let sheet = new CSSStyleSheet();
		sheet.replaceSync(this.getGlobalStyle());
		document.adoptedStyleSheets.push(sheet);
	}

	connectedCallback() {
		if (!("replaceSync" in CSSStyleSheet.prototype) || this.shadowRoot) {
			return;
		}

		AwesomeNav.connected();

		for(let el of this.querySelectorAll(":scope > nav > a[href]")) {
			AwesomeNav.wrapInnerText(el);
		}

		this.podcastLink?.insertAdjacentElement("beforebegin", this.getSpacer());
	}

	getSpacer() {
		let s = this.querySelector(`.${AwesomeNav.classes.spacer}`);
		if(s) {
			return s;
		}
		let d = document.createElement("div");
		d.classList.add(AwesomeNav.classes.spacer);
		return d;
	}

	get buildLink() {
		return this.querySelector(".awesome-nav-build");
	}
	
	get podcastLink() {
		return this.querySelector(".awesome-nav-podcast");
	}

	/* Utility functions */
	static hasExistingIcon(el) {
		return Boolean(el.querySelector("svg,wa-icon,i[class*='fa-']"));
	}

	static createElement(html) {
		let tmpl = document.createElement("template");
		tmpl.innerHTML = html;
		return tmpl.content.firstElementChild;
	}

	static wrapInnerText(node) {
		let w = document.createElement("span");
		let textNodes = Array.from(node.childNodes).filter(c => c.nodeType === 3);
		w.append(...textNodes);
		w.classList.add(AwesomeNav.classes.srOnly);
		if(!node.hasAttribute(AwesomeNav.attrs.label)) {
			node.setAttribute(AwesomeNav.attrs.label, textNodes.map(c => c.textContent).join(", "))
		}
		node.append(w);
	}
}

if(!(new URL(import.meta.url)).searchParams.has("nodefine")) {
	AwesomeNav.define();
}
