/// <reference path="../../../../references.d.ts" />

export interface IBoxShadowValueSet {
	inset: boolean;
	offsetX: number;
	offsetY: number;
	blurRadius: number;
	spreadRadius: number;
	rgba: IRGBA;
}

export interface IBoxShadowEffect {
	effect: IBoxShadowValueSet;
	inlineStyle: string;
}

export interface IRGBA {
	r: number;
	g: number;
	b: number;
	a: number;
}