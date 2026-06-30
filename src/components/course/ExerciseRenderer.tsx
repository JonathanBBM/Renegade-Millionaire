import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { courseStyles } from '@/src/components/course/CourseChrome';
import { CourseSection, ExerciseConfig } from '@/src/types/course';

type ExerciseField = NonNullable<ExerciseConfig['fields']>[number];
type ExerciseGroup = NonNullable<ExerciseConfig['groups']>[number];
type FieldValue = string | number | boolean;

type ExerciseRendererProps = {
  onChange: (response: Record<string, unknown>) => void;
  response: Record<string, unknown>;
  section: CourseSection;
};

function getFieldValue(response: Record<string, unknown>, field: ExerciseField) {
  const value = response[field.key];
  if (field.type === 'checkbox') {
    return Boolean(value);
  }

  return typeof value === 'string' || typeof value === 'number' ? String(value) : '';
}

function setFieldValue(
  response: Record<string, unknown>,
  onChange: (response: Record<string, unknown>) => void,
  field: ExerciseField,
  value: FieldValue,
) {
  onChange({
    ...response,
    [field.key]: value,
  });
}

function FieldControl({
  field,
  onValueChange,
  value,
}: {
  field: ExerciseField;
  onValueChange: (value: FieldValue) => void;
  value: FieldValue;
}) {
  if (field.type === 'checkbox') {
    const checked = Boolean(value);
    return (
      <Pressable
        accessibilityRole="checkbox"
        accessibilityState={{ checked }}
        onPress={() => onValueChange(!checked)}
        style={[styles.checkRow, checked ? styles.checkRowActive : null]}
      >
        <View style={[styles.checkbox, checked ? styles.checkboxActive : null]}>
          {checked ? <Text style={styles.checkboxMark}>✓</Text> : null}
        </View>
        <Text style={styles.checkText}>{checked ? 'Complete' : 'Not complete'}</Text>
      </Pressable>
    );
  }

  if (field.type === 'select' && field.options?.length) {
    return (
      <View style={styles.options}>
        {field.options.map((option) => {
          const active = value === option;
          return (
            <Pressable
              key={option}
              onPress={() => onValueChange(option)}
              style={[styles.option, active ? styles.optionActive : null]}
            >
              <Text style={[styles.optionText, active ? styles.optionTextActive : null]}>{option}</Text>
            </Pressable>
          );
        })}
      </View>
    );
  }

  return (
    <TextInput
      keyboardType={field.type === 'number' ? 'numeric' : 'default'}
      multiline={field.type === 'textarea'}
      onChangeText={(nextValue) => onValueChange(field.type === 'number' ? Number(nextValue) || nextValue : nextValue)}
      placeholder={field.placeholder ?? 'Enter your answer...'}
      placeholderTextColor="#828a80"
      style={[styles.input, field.type === 'textarea' ? styles.textArea : null]}
      textAlignVertical={field.type === 'textarea' ? 'top' : 'center'}
      value={String(value ?? '')}
    />
  );
}

function FieldBlock({
  field,
  onChange,
  response,
}: {
  field: ExerciseField;
  onChange: (response: Record<string, unknown>) => void;
  response: Record<string, unknown>;
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{field.label}</Text>
      {field.helper ? <Text style={courseStyles.muted}>{field.helper}</Text> : null}
      <FieldControl
        field={field}
        onValueChange={(value) => setFieldValue(response, onChange, field, value)}
        value={getFieldValue(response, field)}
      />
    </View>
  );
}

function getGroupRows(response: Record<string, unknown>, group: ExerciseGroup) {
  const rows = Array.isArray(response[group.key]) ? (response[group.key] as Array<Record<string, unknown>>) : [];
  const targetLength = Math.max(group.rowLabels?.length ?? group.repeat ?? 1, rows.length || 1);

  return Array.from({ length: targetLength }, (_, index) => rows[index] ?? {});
}

function GroupBlock({
  group,
  onChange,
  response,
}: {
  group: ExerciseGroup;
  onChange: (response: Record<string, unknown>) => void;
  response: Record<string, unknown>;
}) {
  const rows = getGroupRows(response, group);

  function updateGroupField(rowIndex: number, field: ExerciseField, value: FieldValue) {
    const nextRows = [...rows];
    nextRows[rowIndex] = {
      ...nextRows[rowIndex],
      [field.key]: value,
    };

    onChange({
      ...response,
      [group.key]: nextRows,
    });
  }

  return (
    <View style={styles.group}>
      <Text style={courseStyles.sectionTitle}>{group.label}</Text>
      {rows.map((row, rowIndex) => (
        <View key={`${group.key}-${rowIndex}`} style={styles.groupRow}>
          {rows.length > 1 ? <Text style={styles.groupIndex}>{group.rowLabels?.[rowIndex] ?? `#${rowIndex + 1}`}</Text> : null}
          {group.fields.map((field) => (
            <View key={`${group.key}-${rowIndex}-${field.key}`} style={styles.field}>
              <Text style={styles.fieldLabel}>{field.label}</Text>
              {field.helper ? <Text style={courseStyles.muted}>{field.helper}</Text> : null}
              <FieldControl
                field={field}
                onValueChange={(value) => updateGroupField(rowIndex, field, value)}
                value={getFieldValue(row, field)}
              />
            </View>
          ))}
        </View>
      ))}
    </View>
  );
}

function RatingRows({
  onChange,
  response,
  section,
}: {
  onChange: (response: Record<string, unknown>) => void;
  response: Record<string, unknown>;
  section: CourseSection;
}) {
  const ratingConfig = section.exercise_config?.ratings ?? {
    labels: section.exercise_config?.scale?.labels ?? [],
    max: section.exercise_config?.scale?.max ?? 10,
    min: section.exercise_config?.scale?.min ?? 1,
  };
  const currentRatings =
    typeof response.ratings === 'object' && response.ratings !== null
      ? (response.ratings as Record<string, number>)
      : {};
  const values = useMemo(
    () => Array.from({ length: ratingConfig.max - ratingConfig.min + 1 }, (_, index) => ratingConfig.min + index),
    [ratingConfig.max, ratingConfig.min],
  );

  function updateRating(label: string, rating: number) {
    onChange({
      ...response,
      ratings: {
        ...currentRatings,
        [label]: rating,
      },
    });
  }

  if (ratingConfig.labels.length === 0) {
    return null;
  }

  return (
    <View style={styles.group}>
      <Text style={courseStyles.sectionTitle}>Score Each Area</Text>
      {ratingConfig.labels.map((label) => (
        <View key={label} style={styles.ratingRow}>
          <View style={styles.ratingHeader}>
            <Text style={styles.fieldLabel}>{label}</Text>
            <Text style={styles.ratingValue}>{currentRatings[label] ?? '-'}</Text>
          </View>
          <View style={styles.ratingScale}>
            {values.map((value) => {
              const active = currentRatings[label] === value;
              return (
                <Pressable
                  accessibilityLabel={`${label} ${value}`}
                  key={`${label}-${value}`}
                  onPress={() => updateRating(label, value)}
                  style={[styles.ratingButton, active ? styles.ratingButtonActive : null]}
                >
                  <Text style={[styles.ratingButtonText, active ? styles.ratingButtonTextActive : null]}>{value}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      ))}
    </View>
  );
}

export function ExerciseRenderer({ onChange, response, section }: ExerciseRendererProps) {
  const fields = section.exercise_config?.fields ?? [];
  const groups = section.exercise_config?.groups ?? [];
  const prompts = section.content?.prompts ?? [];
  const showPromptNotes = prompts.length > 0 && fields.length === 0 && groups.length === 0 && section.section_type !== 'rating';

  if (fields.length === 0 && groups.length === 0 && section.section_type !== 'rating' && prompts.length === 0) {
    return null;
  }

  return (
    <View style={courseStyles.card}>
      <Text style={courseStyles.sectionTitle}>
        {section.section_type === 'rating' ? 'Assessment' : section.section_type === 'reflection' ? 'Reflection' : 'Worksheet'}
      </Text>
      {section.exercise_config?.description ? <Text style={courseStyles.copy}>{section.exercise_config.description}</Text> : null}
      {prompts.map((prompt) => (
        <Text key={prompt} style={courseStyles.copy}>
          {prompt}
        </Text>
      ))}
      {showPromptNotes ? (
        <FieldBlock
          field={{ key: 'text', label: 'Your notes', type: 'textarea' }}
          onChange={onChange}
          response={response}
        />
      ) : null}
      {fields.map((field) => (
        <FieldBlock key={field.key} field={field} onChange={onChange} response={response} />
      ))}
      {groups.map((group) => (
        <GroupBlock key={group.key} group={group} onChange={onChange} response={response} />
      ))}
      {section.section_type === 'rating' ? <RatingRows onChange={onChange} response={response} section={section} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  checkbox: {
    alignItems: 'center',
    borderColor: '#596052',
    borderRadius: 6,
    borderWidth: 1,
    height: 24,
    justifyContent: 'center',
    width: 24,
  },
  checkboxActive: { backgroundColor: '#d5a84c', borderColor: '#d5a84c' },
  checkboxMark: { color: '#14170f', fontSize: 14, fontWeight: '900' },
  checkRow: {
    alignItems: 'center',
    borderColor: '#343a32',
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 10,
    padding: 12,
  },
  checkRowActive: { borderColor: '#d5a84c' },
  checkText: { color: '#f5f1e8', fontSize: 15, fontWeight: '800' },
  field: { gap: 8 },
  fieldLabel: { color: '#f5f1e8', fontSize: 15, fontWeight: '900', lineHeight: 20 },
  group: { gap: 14 },
  groupIndex: { color: '#d5a84c', fontSize: 13, fontWeight: '900' },
  groupRow: {
    borderColor: '#2d342b',
    borderRadius: 8,
    borderWidth: 1,
    gap: 12,
    padding: 12,
  },
  input: {
    backgroundColor: '#101410',
    borderColor: '#343a32',
    borderRadius: 8,
    borderWidth: 1,
    color: '#f5f1e8',
    fontSize: 16,
    minHeight: 48,
    padding: 12,
  },
  option: {
    borderColor: '#343a32',
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  optionActive: { backgroundColor: '#d5a84c', borderColor: '#d5a84c' },
  optionText: { color: '#c7cdbf', fontSize: 14, fontWeight: '800' },
  optionTextActive: { color: '#14170f' },
  options: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  ratingButton: {
    alignItems: 'center',
    borderColor: '#343a32',
    borderRadius: 8,
    borderWidth: 1,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  ratingButtonActive: { backgroundColor: '#d5a84c', borderColor: '#d5a84c' },
  ratingButtonText: { color: '#c7cdbf', fontSize: 14, fontWeight: '800' },
  ratingButtonTextActive: { color: '#14170f' },
  ratingHeader: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', gap: 12 },
  ratingRow: { gap: 8 },
  ratingScale: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  ratingValue: { color: '#d5a84c', fontSize: 16, fontWeight: '900' },
  textArea: { minHeight: 120 },
});
