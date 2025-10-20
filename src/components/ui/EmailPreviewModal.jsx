import React, { useState } from 'react';
import { X, Send, Edit2, Copy, Check } from 'lucide-react';
import Button from './Button';
import { cn } from '../../utils/cn';

const EmailPreviewModal = ({ isOpen, onClose, emailData, onSend, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedEmail, setEditedEmail] = useState(emailData || {});
  const [copied, setCopied] = useState(false);

  React.useEffect(() => {
    setEditedEmail(emailData || {});
    setIsEditing(false);
  }, [emailData]);

  if (!isOpen) return null;

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setIsEditing(false);
    if (onEdit) {
      onEdit(editedEmail);
    }
  };

  const handleCopy = () => {
    const fullEmail = `Subject: ${editedEmail.subject}\n\n${editedEmail.greeting}\n\n${editedEmail.body}\n\n${editedEmail.closing}`;
    navigator.clipboard.writeText(fullEmail);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSend = () => {
    if (onSend) {
      onSend(editedEmail);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={onClose}
        ></div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
          <div className="bg-white px-6 py-5 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900">
                {isEditing ? 'Edit Email Draft' : 'Email Preview'}
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="bg-gray-50 px-6 py-8 max-h-[60vh] overflow-y-auto">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedEmail.subject || ''}
                    onChange={(e) => setEditedEmail({ ...editedEmail, subject: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <div className="px-3 py-2 bg-gray-50 rounded-md font-semibold text-gray-900">
                    {editedEmail.subject}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Greeting
                </label>
                {isEditing ? (
                  <textarea
                    value={editedEmail.greeting || ''}
                    onChange={(e) => setEditedEmail({ ...editedEmail, greeting: e.target.value })}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                ) : (
                  <div className="px-3 py-2 bg-gray-50 rounded-md text-gray-800 whitespace-pre-wrap">
                    {editedEmail.greeting}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Body
                </label>
                {isEditing ? (
                  <textarea
                    value={editedEmail.body || ''}
                    onChange={(e) => setEditedEmail({ ...editedEmail, body: e.target.value })}
                    rows={12}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-vertical"
                    style={{ minHeight: '200px', lineHeight: '1.6' }}
                  />
                ) : (
                  <div className="px-3 py-2 bg-gray-50 rounded-md text-gray-800 whitespace-pre-wrap leading-relaxed">
                    {editedEmail.body}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Closing
                </label>
                {isEditing ? (
                  <textarea
                    value={editedEmail.closing || ''}
                    onChange={(e) => setEditedEmail({ ...editedEmail, closing: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                ) : (
                  <div className="px-3 py-2 bg-gray-50 rounded-md text-gray-800 whitespace-pre-wrap">
                    {editedEmail.closing}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row gap-3 sm:gap-2 justify-end">
            <button
              onClick={handleCopy}
              className={cn(
                "inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md font-medium transition-colors",
                copied
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              )}
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied!' : 'Copy'}
            </button>

            {isEditing ? (
              <>
                <button
                  onClick={() => setIsEditing(false)}
                  className="inline-flex items-center justify-center px-4 py-2 bg-gray-100 text-gray-700 rounded-md font-medium hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <Button
                  onClick={handleSave}
                  variant="default"
                  iconName="Check"
                  iconPosition="left"
                >
                  Save Changes
                </Button>
              </>
            ) : (
              <>
                <button
                  onClick={handleEdit}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-md font-medium hover:bg-gray-200 transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit
                </button>
                <Button
                  onClick={handleSend}
                  variant="default"
                  iconName="Send"
                  iconPosition="left"
                >
                  Send Email
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailPreviewModal;
