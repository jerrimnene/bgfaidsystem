'use client';

import React from 'react';

interface ApplicationFormProps {
  applicationId?: string | null;
  onSubmit?: () => void;
  onCancel?: () => void;
}

const ApplicationForm: React.FC<ApplicationFormProps> = ({
  applicationId,
  onSubmit,
  onCancel,
}) => {
  return (
    <div className="p-6 text-center">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        {applicationId ? 'Edit Application' : 'New Application'}
      </h3>
      <p className="text-gray-600 mb-6">
        Application form component will be implemented here.
      </p>
      <div className="flex space-x-4 justify-center">
        <button
          onClick={onCancel}
          className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
        >
          Cancel
        </button>
        <button
          onClick={onSubmit}
          className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default ApplicationForm;