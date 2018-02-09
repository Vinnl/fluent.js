import React from 'react';
import assert from 'assert';
import sinon from 'sinon';
import { shallow } from 'enzyme';
import { MessageContext } from '../../fluent/src';
import ReactLocalization from '../src/localization';
import { Localized } from '../src/index';

suite('Localized - rendering', function() {
  test('render the value', function() {
    const mcx = new MessageContext();
    const l10n = new ReactLocalization([mcx]);

    mcx.addMessages(`
foo = FOO
`)

    const wrapper = shallow(
      <Localized id="foo">
        <div />
      </Localized>,
      { context: { l10n } }
    );

    assert.ok(wrapper.contains(
      <div>FOO</div>
    ));
  });

  test('render an allowed attribute', function() {
    const mcx = new MessageContext();
    const l10n = new ReactLocalization([mcx]);

    mcx.addMessages(`
foo =
    .attr = ATTR
`)

    const wrapper = shallow(
      <Localized id="foo" attrs={{attr: true}}>
        <div />
      </Localized>,
      { context: { l10n } }
    );

    assert.ok(wrapper.contains(
      <div attr="ATTR" />
    ));
  });

  test('only render allowed attributes', function() {
    const mcx = new MessageContext();
    const l10n = new ReactLocalization([mcx]);

    mcx.addMessages(`
foo =
    .attr1 = ATTR 1
    .attr2 = ATTR 2
`)

    const wrapper = shallow(
      <Localized id="foo" attrs={{attr2: true}}>
        <div />
      </Localized>,
      { context: { l10n } }
    );

    assert.ok(wrapper.contains(
      <div attr2="ATTR 2" />
    ));
  });

  test('filter out forbidden attributes', function() {
    const mcx = new MessageContext();
    const l10n = new ReactLocalization([mcx]);

    mcx.addMessages(`
foo =
    .attr = ATTR
`)

    const wrapper = shallow(
      <Localized id="foo" attrs={{attr: false}}>
        <div />
      </Localized>,
      { context: { l10n } }
    );

    assert.ok(wrapper.contains(
      <div />
    ));
  });

  test('filter all attributes if attrs not given', function() {
    const mcx = new MessageContext();
    const l10n = new ReactLocalization([mcx]);

    mcx.addMessages(`
foo =
    .attr = ATTR
`)

    const wrapper = shallow(
      <Localized id="foo">
        <div />
      </Localized>,
      { context: { l10n } }
    );

    assert.ok(wrapper.contains(
      <div />
    ));
  });

  test('preserve existing attributes when setting new ones', function() {
    const mcx = new MessageContext();
    const l10n = new ReactLocalization([mcx]);

    mcx.addMessages(`
foo =
    .attr = ATTR
`)

    const wrapper = shallow(
      <Localized id="foo" attrs={{attr: true}}>
        <div existing={true} />
      </Localized>,
      { context: { l10n } }
    );

    assert.ok(wrapper.contains(
      <div existing={true} attr="ATTR" />
    ));
  });

  test('overwrite existing attributes if allowed', function() {
    const mcx = new MessageContext();
    const l10n = new ReactLocalization([mcx]);

    mcx.addMessages(`
foo =
    .existing = ATTR
`)

    const wrapper = shallow(
      <Localized id="foo" attrs={{existing: true}}>
        <div existing={true} />
      </Localized>,
      { context: { l10n } }
    );

    assert.ok(wrapper.contains(
      <div existing="ATTR" />
    ));
  });

  test('protect existing attributes if setting is forbidden', function() {
    const mcx = new MessageContext();
    const l10n = new ReactLocalization([mcx]);

    mcx.addMessages(`
foo =
    .existing = ATTR
`)

    const wrapper = shallow(
      <Localized id="foo" attrs={{existing: false}}>
        <div existing={true} />
      </Localized>,
      { context: { l10n } }
    );

    assert.ok(wrapper.contains(
      <div existing={true} />
    ));
  });

  test('protect existing attributes by default', function() {
    const mcx = new MessageContext();
    const l10n = new ReactLocalization([mcx]);

    mcx.addMessages(`
foo =
    .existing = ATTR
`)

    const wrapper = shallow(
      <Localized id="foo">
        <div existing={true} />
      </Localized>,
      { context: { l10n } }
    );

    assert.ok(wrapper.contains(
      <div existing={true} />
    ));
  });

  test('preserve children when translation value is null', function() {
    const mcx = new MessageContext();
    const l10n = new ReactLocalization([mcx]);

    mcx.addMessages(`
foo =
    .title = TITLE
`)

    const wrapper = shallow(
      <Localized id="foo" attrs={{title: true}}>
        <select>
          <option>Option</option>
        </select>
      </Localized>,
      { context: { l10n } }
    );

    assert.ok(wrapper.contains(
      <select title="TITLE">
        <option>Option</option>
      </select>
    ));
  });


  test('$arg is passed to format the value', function() {
    const mcx = new MessageContext();
    const format = sinon.spy(mcx, 'format');
    const l10n = new ReactLocalization([mcx]);

    mcx.addMessages(`
foo = { $arg }
`)

    const wrapper = shallow(
      <Localized id="foo" $arg="ARG">
        <div />
      </Localized>,
      { context: { l10n } }
    );

    const { args } = format.getCall(0);
    assert.deepEqual(args[1], { arg: 'ARG' });
  });

  test('$arg is passed to format the attributes', function() {
    const mcx = new MessageContext();
    const format = sinon.spy(mcx, 'format');
    const l10n = new ReactLocalization([mcx]);

    mcx.addMessages(`
foo = { $arg }
    .attr = { $arg }
`)

    const wrapper = shallow(
      <Localized id="foo" $arg="ARG">
        <div />
      </Localized>,
      { context: { l10n } }
    );

    const { args } = format.getCall(0);
    assert.deepEqual(args[1], { arg: 'ARG' });
  });
});
