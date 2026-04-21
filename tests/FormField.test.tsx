// Component test - FormField renders and fires onChangeText
// Adapted from Week 12 Tutorial: https://ucc.instructure.com/courses/86289/files
// https://github.com/rorypierce111/react-native-lab/blob/main/tests/FormField.test.tsx 
import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import FormField from '../components/ui/form-field';

describe('FormField', () => {
  it('renders the label and fires onChangeText', () => {
    const onChangeTextMock = jest.fn();

    const { getByText, getByLabelText } = render(
      <FormField label="Company name" value="" onChangeText={onChangeTextMock} />
    );

    expect(getByText('Company name')).toBeTruthy();
    expect(getByLabelText('Company name')).toBeTruthy();

    fireEvent.changeText(getByLabelText('Company name'), 'Google');

    expect(onChangeTextMock).toHaveBeenCalledWith('Google');
  });

  it('renders placeholder text', () => {
    const { getByPlaceholderText } = render(
      <FormField
        label="Position"
        value=""
        onChangeText={jest.fn()}
        placeholder="e.g. Software Engineer"
      />
    );

    expect(getByPlaceholderText('e.g. Software Engineer')).toBeTruthy();
  });
});