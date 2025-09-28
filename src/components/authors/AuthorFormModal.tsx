import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Modal from '../shared/Modal';
import Button from '../shared/Button';

const AuthorSchema = Yup.object({
  name: Yup.string().trim().required('Name is required'),
});

export interface AuthorFormValues {
  name: string;
}

interface AuthorFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  initialValues?: AuthorFormValues;
  onSubmit: (values: AuthorFormValues) => Promise<void> | void;
  submitText?: string;
}

export default function AuthorFormModal({
  isOpen,
  onClose,
  title,
  initialValues = { name: '' },
  onSubmit,
  submitText = 'Save',
}: AuthorFormModalProps) {
  return (
    <Modal isOpen={isOpen} onRequestClose={onClose} title={title} footer={null}>
      <Formik
        initialValues={initialValues}
        validationSchema={AuthorSchema}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            await onSubmit({ name: values.name.trim() });
            onClose();
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <Field
                name="name"
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm"
              />
              <ErrorMessage
                name="name"
                component="div"
                className="mt-1 text-sm text-rose-600"
              />
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
