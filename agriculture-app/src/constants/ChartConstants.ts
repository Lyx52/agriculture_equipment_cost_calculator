/* eslint-disable  @typescript-eslint/no-explicit-any */
import { DisplayNumber } from '@/utils.ts'
import type { FontSpec } from 'chart.js'

export const ChartConstants = {
  LargeTextFontBold: {
    family: 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", "Noto Sans", "Liberation Sans", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
    size: 20,
    style: 'normal',
    weight: 'bold',
    color: '#000',
    lineHeight: 1.2
  } as FontSpec,
  MediumTextFontBold: {
    family: 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", "Noto Sans", "Liberation Sans", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
    size: 12,
    style: 'normal',
    weight: 'bold',
    color: '#000',
    lineHeight: 1.1
  } as FontSpec,
  SmallTextFontBold: {
    family: 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", "Noto Sans", "Liberation Sans", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
    size: 10,
    style: 'normal',
    weight: 'bold',
    color: '#000',
    lineHeight: 1.0
  } as FontSpec,
  LargeTextFont: {
    family: 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", "Noto Sans", "Liberation Sans", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
    size: 20,
    style: 'normal',
    weight: 'normal',
    color: '#000',
    lineHeight: 1.2
  } as FontSpec,
  MediumTextFont: {
    family: 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", "Noto Sans", "Liberation Sans", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
    size: 12,
    style: 'normal',
    weight: 'normal',
    color: '#000',
    lineHeight: 1.1
  } as FontSpec,
  SmallTextFont: {
    family: 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", "Noto Sans", "Liberation Sans", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
    size: 10,
    style: 'normal',
    weight: 'normal',
    color: '#000',
    lineHeight: 1.0
  } as FontSpec,
  FormatterEuro: function(value: any) {
    return `${typeof value !== 'string' ? value?.toFixed(2) : value} €`;
  },
  FormatterDisplayNumber: function(value: any) {
    return DisplayNumber(value);
  },
}
