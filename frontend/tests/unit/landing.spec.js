import { mount } from '@vue/test-utils'
import Landing from '../../src/components/Landing'

describe('Landing.vue', () => {
	it('renders title', () => {
		const wrapper = mount(Landing)
		expect(wrapper.classes('container')).toBe(true)
	})
})
