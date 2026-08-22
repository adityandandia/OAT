import { useEffect, useState } from "react";
import CreateAssessmentModal from "../../components/CreateAssessmentModal";
import { getAllTests, deleteTest } from "../../services/testsService";

function AllTestsPage() {
  const [tests, setTests] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreated = async (result) => {
    setIsModalOpen(false);
    const data = await getAllTests();
    setTests(data);
    console.log("Created result:", result);
  };

  useEffect(() => {
    getAllTests().then((data) => {
        console.log("Got tests:", data);
        setTests(data);
    });
  }, []);

  const handleDelete = async (testId) => {
    const confirmed = window.confirm("Delete this test?");
    if (!confirmed) return;

    await deleteTest(testId);
    const data = await getAllTests();
    setTests(data);
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2>All Tests</h2>
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          + Create New Test
        </button>
      </div>

      {tests.map((t) => (
        <div key={t.test_id} className="mb-2 flex items-center justify-between rounded border p-3">
          <span>{t.test_title}</span>
          <button
            type="button"
            aria-label={`Delete ${t.test_title}`}
            onClick={() => handleDelete(t.test_id)}
            className="ml-4 rounded bg-red-100 px-2 py-1 text-sm text-red-700 hover:bg-red-200"
          >
            🗑️ Delete
          </button>
        </div>
      ))}

      <CreateAssessmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreated={handleCreated}
      />
    </div>
  );
}

export default AllTestsPage;
