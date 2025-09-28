import { useMemo } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Modal from '../shared/Modal';
import Button from '../shared/Button';
import type { Author } from '../../../shared/types';
import { useCreateAuthor } from '../../hooks/useAuthors';

export interface BookFormValues {
  title: string;
  authorId: number | null;
  createNewAuthor: boolean;
  newAuthorName?: string;
}

const BookSchema = Yup.object({
  title: Yup.string().trim().required('Title is required'),
  createNewAuthor: Yup.boolean(),
  authorId: Yup.number()
    .nullable()
    .when('createNewAuthor', {
      is: false,
      then: schema => schema.required('Author is required'),
    })
    .label('Author'),
  newAuthorName: Yup.string()
    .when('createNewAuthor', {
      is: true,
      then: schema => schema.trim().required('Author name is required'),
    })
    .label('Author name'),
});

interface BookFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  authors: Author[];
  initialValues?: Partial<BookFormValues> & { title?: string };
  onSubmit: (values: {
    title: string;
    author_id: number;
  }) => Promise<void> | void;
  submitText?: string;
}

export default function BookFormModal({
  isOpen,
  onClose,
  title,
  authors,
  initialValues,
  onSubmit,
  submitText = 'Save',
}: BookFormModalProps) {
  const createAuthor = useCreateAuthor();

  const sortedAuthors = useMemo(() => {
    return [...authors].sort((a, b) => a.name.localeCompare(b.name));
  }, [authors]);

  const defaultValues: BookFormValues = {
    title: initialValues?.title ?? '',
    authorId: initialValues?.authorId ?? null,
    createNewAuthor: false,
    newAuthorName: initialValues?.newAuthorName,
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onClose} title={title} footer={null}>
      <Formik
        initialValues={defaultValues}
        validationSchema={BookSchema}
        enableReinitialize
        onSubmit={async vals => {
          console.log('submit');
          try {
            let authorId: number | null;
            if (vals.createNewAuthor && vals.newAuthorName) {
              // Create a new author and get the ID
              const { id } = await createAuthor.mutateAsync(
                vals.newAuthorName.trim(),
              );
              authorId = id as number;
            } else {
              authorId = vals.authorId as number;
            }
            await onSubmit({ title: vals.title.trim(), author_id: authorId });
            onClose();
          } finally {
            console.log('false');
          }
        }}
      >
        {({ values, setFieldValue, isSubmitting }) => (
          <Form className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <Field
                name="title"
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm"
              />
              <ErrorMessage
                name="title"
                component="div"
                className="mt-1 text-sm text-rose-600"
              />
            </div>

            {!values.createNewAuthor ? (
              <div>
                <label className="block text-sm font-medium mb-1">Author</label>
                <select
                  name="authorId"
                  value={values.authorId ?? ''}
                  onChange={e =>
                    setFieldValue(
                      'authorId',
                      e.target.value === '' ? null : Number(e.target.value),
                    )
                  }
                  className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm"
                >
                  <option value="">Select an author</option>
                  {sortedAuthors.map(a => (
                    <option key={a.id} value={a.id}>
                      {a.name}
                    </option>
                  ))}
                </select>
                <ErrorMessage
                  name="authorId"
                  component="div"
                  className="mt-1 text-sm text-rose-600"
                />
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium mb-1">
                  New author name
                </label>
                <Field
                  name="newAuthorName"
                  className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm"
                />
                <ErrorMessage
                  name="newAuthorName"
                  component="div"
                  className="mt-1 text-sm text-rose-600"
                />
              </div>
            )}
            <div className="flex items-center gap-2">
              <input
                id="createNewAuthor"
                type="checkbox"
                checked={values.createNewAuthor}
                onChange={e =>
                  setFieldValue('createNewAuthor', e.target.checked)
                }
              />
              <label htmlFor="createNewAuthor" className="text-sm">
                Add a new author
              </label>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {submitText}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </Modal>
  );
}
