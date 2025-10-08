import React, { useState } from "react";
import { useLanguage } from "../i18n/LanguageContext";

interface SchoolConfig {
  name: string;
  baseUrl: string;
}

interface SchoolListProps {
  allSchools: Record<string, SchoolConfig>;
  customSchools: Record<string, SchoolConfig>;
  onDeleteSchool: (key: string) => void;
}

const SchoolList: React.FC<SchoolListProps> = ({
  allSchools,
  customSchools,
  onDeleteSchool,
}) => {
  const { t } = useLanguage();
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const allSchoolEntries = Object.entries(allSchools);

  // Always show the button if there are any schools
  if (allSchoolEntries.length === 0) {
    return null;
  }

  // Check if a school is custom (can be deleted)
  const isCustomSchool = (key: string) => key in customSchools;

  const handleDeleteClick = (key: string) => {
    setDeleteConfirm(key);
  };

  const handleConfirmDelete = (key: string) => {
    onDeleteSchool(key);
    setDeleteConfirm(null);
  };

  const handleCancelDelete = () => {
    setDeleteConfirm(null);
  };

  return (
    <div className="school-list-container">
      {!isOpen ? (
        <button
          className="btn-view-schools"
          onClick={() => setIsOpen(true)}
          aria-label={t.viewAllSchools}
        >
          <span className="icon">📋</span>
          <span>
            {t.viewAllSchools} ({allSchoolEntries.length})
          </span>
        </button>
      ) : (
        <div className="school-list-card">
          <div className="school-list-header">
            <h3>{t.allSchoolsTitle}</h3>
            <button
              className="btn-close"
              onClick={() => setIsOpen(false)}
              aria-label={t.close}
            >
              ✕
            </button>
          </div>

          <div className="school-list-content">
            {allSchoolEntries.map(([key, config]) => (
              <div key={key} className="school-item">
                <div className="school-item-info">
                  <div className="school-item-header">
                    <h4 className="school-item-name">{config.name}</h4>
                    <div className="school-badges">
                      <span className="school-item-key">{key}</span>
                      {!isCustomSchool(key) && (
                        <span className="school-item-badge-builtin">
                          {t.builtIn}
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="school-item-url">{config.baseUrl}</p>
                </div>

                {deleteConfirm === key ? (
                  <div className="delete-confirm">
                    <p className="delete-confirm-text">
                      {t.confirmDeleteSchool}
                    </p>
                    <div className="delete-confirm-actions">
                      <button
                        className="btn-delete-cancel"
                        onClick={handleCancelDelete}
                      >
                        {t.cancel}
                      </button>
                      <button
                        className="btn-delete-confirm"
                        onClick={() => handleConfirmDelete(key)}
                      >
                        {t.deleteConfirm}
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    {isCustomSchool(key) ? (
                      <button
                        className="btn-delete-school"
                        onClick={() => handleDeleteClick(key)}
                        aria-label={`${t.deleteSchool} ${config.name}`}
                      >
                        🗑️
                      </button>
                    ) : (
                      <div
                        className="btn-delete-school disabled"
                        title={t.cannotDeleteBuiltIn}
                      >
                        🔒
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>

          {allSchoolEntries.length === 0 && (
            <div className="no-schools-message">
              <p>{t.noSchools}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SchoolList;
