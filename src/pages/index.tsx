import React, { useState } from 'react';
import { dbConnect } from '@/lib/dbConnect';
import RuleBook from '@/models/RuleBook';
import { Section } from '@/models/RuleBook';

export default function RulesPage({ sections }: { sections: Section[] }) {
  const isNoSection = !sections || sections.length === 0;

  const uniqueSections = isNoSection ? [] : Array.from(new Set(sections.map(section => section.section)));
  const [activeTab, setActiveTab] = useState(isNoSection ? "" : uniqueSections[0]);

  if (isNoSection) {
    return (
      <div style={{
        fontFamily: 'Arial, sans-serif',
        backgroundColor: '#171616',
        color: '#959493',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        minHeight: '100vh',
        margin: 0,
        padding: 20,
        boxSizing: 'border-box',
      }}>
        <table className="page-title">
          <thead>
            <tr>
              <th>{"// RuleBook (No Sections Available) //"}</th> {/* It thinks // is comment so used string JSX */}
            </tr>
          </thead>
        </table>
      </div>
    );
  }

  const switchTab = (tabName: string) => {
    unloadContent();
    setActiveTab(tabName);
  };

  const unloadContent = () => {
    const contentDiv = document.getElementById("content-container");
    if (!contentDiv) return;
    contentDiv.innerHTML = '';
  }

  const loadContent = (title: string) => {
    const contentDiv = document.getElementById("content-container");
    if (!contentDiv) return;

    // Assuming contentItem is the title and you need to fetch the corresponding content
    const sectionContent = sections.find((section) => section.section === activeTab && section.title === title);
    if (!sectionContent) return;
    contentDiv.innerHTML = sectionContent.content;
  }

  return (
    <div style={{
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#171616',
      color: '#959493',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      minHeight: '100vh',
      margin: 0,
      padding: 20,
      boxSizing: 'border-box',
    }}>
      <table className="page-title">
        <thead>
          <tr>
            <th>{"// RuleBook //"}</th> {/* It thinks // is comment so used string JSX */}
          </tr>
        </thead>
      </table>

      <div className="button-container">
        {uniqueSections.map((sectionName) => (
          <button key={sectionName} className={`tab-button ${activeTab === sectionName ? 'active' : ''}`} onClick={() => switchTab(sectionName)}>{sectionName}</button>
        ))}
      </div>

      <div className="outer-container active">
        <div className="inner-wrapper">
          <div className="legend-box">
            <ul className="sub-list">
              {sections.filter((section) => section.section === activeTab).map((section) => (
                <li key={section.title}>
                  <span className="sub-name"><a href="#" onClick={(e) => { e.preventDefault(); loadContent(section.title); }}>{section.title}</a>: </span>
                  <span className="sub-overview">{section.description}</span>
                </li>
              ))}
            </ul>
          </div>
          <div id="content-container"></div>
        </div>
      </div>
    </div>
  );

}

export async function getServerSideProps() {
  await dbConnect();
  const collections = await RuleBook.find().lean()


  const sections: Section[] = collections.map((section) => ({
    _id: "",
    section: section.section,
    title: section.title,
    description: section.description,
    content: section.content,
  }));


  return {
    props: {
      sections,
    },
  };
}

